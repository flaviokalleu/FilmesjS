const axios = require('axios');
const cheerio = require('cheerio');
const { Series, Season, Episode } = require('../models');

// Controlador para buscar e salvar os arquivos da série
const SeriesFileController = {
  async fetchAndSaveSeriesFiles(req, res) {
    // Importa p-limit dinamicamente
    const pLimit = await import('p-limit').then(module => module.default);
    const limit = pLimit(1); // Limite de 1 requisição simultânea
    const tmdbCache = new Map(); // Cache para resultados do TMDB

    // Função para buscar os animes do site, percorrendo todas as páginas
    const fetchAnimesFromWebsite = async () => {
      try {
        const animes = [];
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const url = `https://animesonlinecc.to/anime/page/${page}/`;
          try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const animeElements = $('html body div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) article');

            if (animeElements.length === 0) {
              hasMorePages = false; // Se não houver mais animes, sai do loop
            } else {
              animeElements.each((index, element) => {
                const title = $(element).find('div:nth-of-type(2) h3 a').text().trim();
                const link = $(element).find('div:nth-of-type(2) h3 a').attr('href');
                animes.push({ title, link });
              });
              page++; // Incrementa a página
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.warn(`Page not found: ${url}. Stopping further requests.`);
              hasMorePages = false; // Para o loop se uma página não for encontrada
            } else {
              console.error(`Error fetching page ${url}:`, error.message);
              break; // Para o loop em caso de outro erro
            }
          }
        }

        return animes;
      } catch (error) {
        console.error('Error fetching animes from website:', error.message);
        throw error;
      }
    };

    // Função para buscar TMDB ID com cache
    const fetchTmdbId = async (title) => {
      if (tmdbCache.has(title)) {
        return tmdbCache.get(title); // Retorna o ID do cache
      }

      const tmdbResponse = await axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=pt-BR`
      );

      const tmdb_id = tmdbResponse.data.results[0]?.id; // Captura o primeiro resultado
      if (tmdb_id) {
        tmdbCache.set(title, tmdb_id); // Armazena no cache
      }
      return tmdb_id;
    };

    try {
      console.log('Fetching animes from the website...');
      const animes = await fetchAnimesFromWebsite();
      console.log('Animes fetched:', animes);

      for (const { title, link } of animes) {
        console.log(`Processing anime: ${title}`);

        try {
          const tmdb_id = await limit(() => fetchTmdbId(title));

          if (!tmdb_id) {
            console.warn(`No TMDB ID found for title: ${title}. Skipping...`);
            continue; // Pular se não houver TMDB ID
          }

          console.log(`Fetched TMDB ID for ${title}: ${tmdb_id}`);
          const seriesResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
          );
          const seriesData = seriesResponse.data;

          // Criar ou atualizar a série no banco de dados
          await Series.upsert({
            tmdb_id: seriesData.id,
            name: seriesData.name,
            overview: seriesData.overview,
            backdrop_path: seriesData.backdrop_path,
            first_air_date: seriesData.first_air_date,
            last_air_date: seriesData.last_air_date,
            number_of_episodes: seriesData.number_of_episodes,
            number_of_seasons: seriesData.number_of_seasons,
            original_language: seriesData.original_language,
            status: seriesData.status,
            popularity: seriesData.popularity,
            vote_average: seriesData.vote_average,
            vote_count: seriesData.vote_count,
            homepage: seriesData.homepage,
            poster_path: seriesData.poster_path,
            logo_path: seriesData.logo_path, // Adicionando a nova propriedade logo_path
        });
        

          // Acessa a página do anime
          const animePageResponse = await axios.get(link);
          const $animePage = cheerio.load(animePageResponse.data); // Carregando o Cheerio corretamente aqui

          // Coletar o número de temporadas
          const seasonElements = $animePage("#seasons > div");
          const seasonsCount = seasonElements.length;

          if (seasonsCount === 0) {
            console.warn(`Nenhuma temporada encontrada para ${title}.`);
            continue; // Pular se não houver temporadas
          }

          console.log(`Número de temporadas: ${seasonsCount}`);

          // Iterar sobre cada temporada
          for (let i = 1; i <= seasonsCount; i++) {
            let season = await Season.findOne({
              where: { series_tmdb_id: seriesData.id, season_number: i },
            });

            if (!season) {
              // Buscar detalhes da temporada no TMDB com throttle
              const seasonResponse = await limit(() =>
                axios.get(
                  `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${i}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
                )
              );
              const seasonData = seasonResponse.data;

              // Criar a temporada no banco de dados
              season = await Season.create({
                series_tmdb_id: seriesData.id,
                season_number: seasonData.season_number,
                air_date: seasonData.air_date,
                episode_count: seasonData.episodes.length,
                overview: seasonData.overview,
                poster_path: seasonData.poster_path,
                vote_average: seasonData.vote_average,
              });
            }

            // Obter os episódios da temporada
            const episodes = $animePage(`#seasons > div:nth-child(${i}) > div.se-a > ul > li`);

            if (episodes.length === 0) {
              console.warn(`Nenhum episódio encontrado para a temporada ${i} de ${title}.`);
              continue; // Pular se não houver episódios
            }

            for (let episodeElement of episodes) {
              const episodeLink = $animePage(episodeElement).find('div.episodiotitle > a').attr('href'); // link do episódio
              const episodeTitle = $animePage(episodeElement).find('div.episodiotitle > a').text().trim(); // título do episódio

              // Extrair o número do episódio do título
              const episodeMatch = episodeTitle.match(/Episod[ií]o\s*(\d+)/i);
              const episode_number = episodeMatch ? parseInt(episodeMatch[1], 10) : null;

              if (!episode_number) {
                console.warn(`Could not extract episode number from title: "${episodeTitle}". Skipping...`);
                console.log(`Title format: "${episodeTitle}"`); // Log para ajudar a entender o formato
                continue;
              }

              // Verificar se o episódio já existe no banco de dados
              const existingEpisode = await Episode.findOne({
                where: { season_id: season.id, episode_number },
              });

              if (existingEpisode) {
                console.log(`Episode ${existingEpisode.name} already exists. Skipping...`);
                continue; // Ignorar se o episódio já existir
              }

              // Acessar a página do episódio com throttle
              const episodePageResponse = await limit(() => axios.get(episodeLink));
              const $episodePage = cheerio.load(episodePageResponse.data); // Carregando o Cheerio para a página do episódio

              // Captura do link iframe
              const iframeSrc = $episodePage('#option-1 > iframe').attr('src');

              // Verifica se o iframe foi encontrado
              if (!iframeSrc) {
                console.warn(`Iframe link not found for episode ${episodeTitle}. Skipping...`);
                continue;
              }

              // Buscar detalhes do episódio no TMDB com throttle
              const episodeResponse = await limit(() =>
                axios.get(
                  `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season.season_number}/episode/${episode_number}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
                )
              );
              const episodeData = episodeResponse.data;

              // Criar o episódio no banco de dados
              await Episode.create({
                name: episodeData.name,
                overview: episodeData.overview,
                vote_average: episodeData.vote_average,
                vote_count: episodeData.vote_count,
                air_date: episodeData.air_date, // Adicionando data de exibição
                episode_number, // Usando a variável correta
                still_path: episodeData.still_path, // Caminho da imagem
                season_id: season.id,
                link: iframeSrc, // Link do episódio, caso exista
                runtime: episodeData.runtime, // Duração do episódio
                production_code: episodeData.production_code, // Código de produção
                guest_stars: episodeData.guest_stars, // Estrelas convidadas em formato JSON
                crew: episodeData.crew, // Informações sobre a equipe em formato JSON
              });
              

              console.log(`Episódio ${episodeTitle} processado e salvo.`);
            }
          }
        } catch (error) {
          console.error(`Error processing anime ${title}:`, error.message);
        }
      }

      res.status(200).json({ message: 'All series and episodes fetched and saved successfully.' });
    } catch (error) {
      console.error('Error in fetchAndSaveSeriesFiles:', error.message);
      res.status(500).json({ error: 'Erro ao buscar arquivos de séries' });
    }
  },
};

module.exports = SeriesFileController;
