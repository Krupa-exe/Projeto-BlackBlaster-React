const API_KEY = '3f4e9dcff6a568a6d77c5e6b1a7012f6'; // Substitua pela sua chave do TMDB
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Busca o poster de um filme pelo título no TMDB.
 * Retorna a URL completa da imagem ou null se não encontrar.
 */
export async function buscarPosterPorTitulo(titulo) {
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(titulo)}`
    );
    const data = await res.json();
    const filme = data.results?.[0];
    if (filme?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Busca detalhes extras de um filme pelo título (sinopse, nota, etc).
 * Útil se quiser exibir mais informações futuramente.
 */
export async function buscarDetalhesPorTitulo(titulo) {
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(titulo)}`
    );
    const data = await res.json();
    return data.results?.[0] || null;
  } catch {
    return null;
  }
}