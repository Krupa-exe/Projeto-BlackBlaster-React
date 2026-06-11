require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const jwt      = require("jsonwebtoken");
const bcrypt   = require("bcryptjs");
const mysql    = require("mysql2/promise");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");

const app    = express();
const SECRET = process.env.SECRET_KEY || "troque-esta-chave-em-producao";

app.use(cors());
app.use(express.json());

// ─── Servir arquivos de upload estaticamente ──────────────────────────────────
// Ex: http://localhost:3001/uploads/avatar-1.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Banco ───────────────────────────────────────────────────────────────────

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "#MySQL@2023!",
  database: process.env.DB_NAME     || "blackblaster",
});

// ─── Multer — upload de avatar ────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // avatar-<id>.<ext> — sobrescreve o anterior automaticamente
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${req.usuario.id}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const permitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (permitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens sao permitidas (jpeg, png, webp, gif)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ─── Middleware: verificar token ──────────────────────────────────────────────

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ detail: "Token nao fornecido" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (erro, decoded) => {
    if (erro) return res.status(401).json({ detail: "Token invalido ou expirado" });
    req.usuario = decoded;
    next();
  });
}

function verificarAdmin(req, res, next) {
  if (req.usuario?.tipo !== "admin") {
    return res.status(403).json({ detail: "Acesso restrito a administradores" });
  }
  next();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

app.post("/login", async (req, res) => {
  const { login, senha } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id_usuario, nome, email, login, senha, tipo, plano, avatar FROM usuario WHERE login = ?",
      [login]
    );

    const usuario = rows[0];

    if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
      return res.status(401).json({ detail: "Login ou senha invalidos" });
    }

    const token = jwt.sign(
      {
        id:    usuario.id_usuario,
        login: usuario.login,
        nome:  usuario.nome,
        email: usuario.email,
        tipo:  usuario.tipo,
      },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      usuario: {
        nome:   usuario.nome,
        email:  usuario.email,
        login:  usuario.login,
        tipo:   usuario.tipo,
        plano:  usuario.plano,
        avatar: usuario.avatar || null,
      },
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ detail: "Erro interno do servidor" });
  }
});

app.post("/cadastro", async (req, res) => {
  const { nome, email, cpf, login, senha, plano, telefone, data_nascimento } = req.body;

  if (!nome || !email || !cpf || !login || !senha || !plano) {
    return res.status(400).json({ detail: "Preencha todos os campos obrigatorios" });
  }

  try {
    const [existente] = await pool.query(
      "SELECT id_usuario FROM usuario WHERE email = ? OR cpf = ? OR login = ?",
      [email, cpf, login]
    );

    if (existente.length > 0) {
      return res.status(409).json({ detail: "E-mail, CPF ou login ja cadastrado" });
    }

    const hashSenha = bcrypt.hashSync(senha, 10);

    await pool.query(
      `INSERT INTO usuario (nome, email, cpf, login, senha, plano, telefone, data_nascimento, tipo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'cliente')`,
      [nome, email, cpf, login, hashSenha, plano, telefone || null, data_nascimento || null]
    );

    res.status(201).json({ mensagem: `Usuario ${nome} cadastrado com sucesso!` });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ detail: "Erro interno do servidor" });
  }
});

// ─── Avatar ───────────────────────────────────────────────────────────────────

// POST /avatar — recebe o arquivo, salva no disco, atualiza o caminho no BD
app.post("/avatar", verificarToken, upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: "Nenhum arquivo enviado" });
  }

  // Caminho publico acessivel pelo front
  const avatarUrl = `http://localhost:3001/uploads/${req.file.filename}`;

  try {
    await pool.query(
      "UPDATE usuario SET avatar = ? WHERE id_usuario = ?",
      [avatarUrl, req.usuario.id]
    );

    res.json({ avatar: avatarUrl });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ detail: "Erro ao salvar avatar" });
  }
});

// Middleware de erro do Multer (tamanho e tipo)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ detail: "Arquivo muito grande. Maximo 5MB." });
    }
  }
  if (err) {
    return res.status(400).json({ detail: err.message });
  }
  next();
});

// ─── Filmes ───────────────────────────────────────────────────────────────────

app.get("/filmes", async (req, res) => {
  const { genero } = req.query;

  try {
    let query = `
      SELECT f.id_filme, f.titulo, f.ano_lancamento, f.preco_diaria, f.poster,
             g.nome_genero
      FROM filme f
      JOIN genero g ON f.fk_genero = g.id_genero
    `;
    const params = [];

    if (genero) {
      query += " WHERE f.fk_genero = ?";
      params.push(genero);
    }

    const [filmes] = await pool.query(query, params);
    res.json({ filmes });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ detail: "Erro ao buscar filmes" });
  }
});

app.get("/generos", async (req, res) => {
  try {
    const [generos] = await pool.query(
      "SELECT id_genero, nome_genero FROM genero ORDER BY nome_genero"
    );
    res.json({ generos });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ detail: "Erro ao buscar generos" });
  }
});

// ─── Locacoes ─────────────────────────────────────────────────────────────────

app.get("/alugados", verificarToken, async (req, res) => {
  try {
    const [filmes] = await pool.query(
      `SELECT l.id_locacao, l.data_inicio, l.data_devolucao, l.status,
              f.titulo, f.poster, f.preco_diaria, f.ano_lancamento,
              g.nome_genero
       FROM locacao l
       JOIN filme  f ON l.fk_filme  = f.id_filme
       JOIN genero g ON f.fk_genero = g.id_genero
       WHERE l.fk_usuario = ?
       ORDER BY l.data_inicio DESC`,
      [req.usuario.id]
    );

    res.json({ filmes });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ detail: "Erro ao buscar filmes alugados" });
  }
});

app.post("/alugados", verificarToken, async (req, res) => {
  const filmes = req.body.filmes;

  if (!Array.isArray(filmes) || filmes.length === 0) {
    return res.status(400).json({ detail: "Nenhum filme no pedido" });
  }

  const hoje          = new Date();
  const dataDevolucao = new Date(hoje);
  dataDevolucao.setDate(dataDevolucao.getDate() + 7);

  const dataInicio     = hoje.toISOString().split("T")[0];
  const dataDevolucaoF = dataDevolucao.toISOString().split("T")[0];

  try {
    for (const item of filmes) {
      const [ativo] = await pool.query(
        "SELECT id_locacao FROM locacao WHERE fk_usuario = ? AND fk_filme = ? AND status = 'ativo'",
        [req.usuario.id, item.id_filme]
      );

      if (ativo.length > 0) {
        const [[filme]] = await pool.query(
          "SELECT titulo FROM filme WHERE id_filme = ?",
          [item.id_filme]
        );
        return res.status(409).json({ detail: `'${filme.titulo}' ja esta alugado e ativo` });
      }
    }

    for (const item of filmes) {
      await pool.query(
        `INSERT INTO locacao (data_inicio, data_devolucao, status, fk_usuario, fk_filme)
         VALUES (?, ?, 'ativo', ?, ?)`,
        [dataInicio, dataDevolucaoF, req.usuario.id, item.id_filme]
      );
    }

    res.status(201).json({ mensagem: "Pedido finalizado com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ detail: "Erro ao finalizar pedido" });
  }
});

// ─── Admin ────────────────────────────────────────────────────────────────────

app.get("/usuarios", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      `SELECT id_usuario, nome, email, login, cpf, plano, tipo, data_cadastro
       FROM usuario
       ORDER BY data_cadastro DESC`
    );
    res.json({ usuarios });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ detail: "Erro ao buscar usuarios" });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});