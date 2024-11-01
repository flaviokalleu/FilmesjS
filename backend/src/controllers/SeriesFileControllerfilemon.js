const axios = require('axios');
const { Series, Season, Episode } = require('../models');

// Função para buscar as pastas da API do FileMoon
const fetchFoldersFromAPI = async () => {
  try {
    const url = `https://filemoonapi.com/api/folder/list?key=32432nh97do6cze51lwrb&fld_id=136501`;
    const response = await axios.get(url);
    return response.data.result.folders;
  } catch (error) {
    console.error('Error fetching folders from FileMoon API:', error.message);
    throw error;
  }
};

// Função para buscar os arquivos dentro de uma pasta
const fetchFilesFromFolder = async (fld_id) => {
  try {
    const url = `https://filemoonapi.com/api/file/list?key=32432nh97do6cze51lwrb&fld_id=${fld_id}`;
    const response = await axios.get(url);
    return response.data.result.files;
  } catch (error) {
    console.error('Error fetching files from FileMoon API:', error.message);
    throw error;
  }
};

// Controlador para buscar e salvar os arquivos da série
const SeriesFileController = {
  async fetchAndSaveSeriesFiles(req, res) {
    try {
      // Buscar pastas da API do FileMoon
      console.log('Fetching folders from FileMoon API...');
      const folders = await fetchFoldersFromAPI();
      console.log('Folders fetched:', folders);

      // Iterar sobre cada pasta e extrair o tmdb_id do nome
      for (const folder of folders) {
        const { name, fld_id } = folder;
        console.log(`Processing folder: ${name}`);

        // Extrair tmdb_id do nome
        const tmdbIdMatch = name.match(/\s-\s\((\d+)\)$/); // Ajuste de regex para tmdb_id
        const tmdb_id = tmdbIdMatch ? tmdbIdMatch[1] : null;

        if (!tmdb_id) {
          console.warn(`tmdb_id not found in folder name: ${name}. Skipping...`);
          continue;
        }

        console.log(`Extracted tmdb_id: ${tmdb_id}`);

        try {
          // Buscar detalhes da série do TMDB
          const tmdbResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
          );
          const seriesData = tmdbResponse.data;
          console.log(`Fetched data for TMDB ID ${tmdb_id}:`, seriesData);

          // Criar ou atualizar a série no banco de dados
          const [series, created] = await Series.upsert({
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
          });

          // Buscar arquivos da pasta
          const files = await fetchFilesFromFolder(fld_id);
          console.log(`Files fetched for folder ${fld_id}:`, files);

          // Iterar sobre os arquivos e salvar episódios
          for (const file of files) {
            const { title, link } = file;

            // Extrair temporada e episódio do título
            const episodeMatch = title.match(/S(\d{2})E(\d{2})/);
            const season_number = episodeMatch ? parseInt(episodeMatch[1], 10) : null;
            const episode_number = episodeMatch ? parseInt(episodeMatch[2], 10) : null;

            if (!season_number || !episode_number) {
              console.warn(`Could not extract season or episode from title: ${title}. Skipping...`);
              continue;
            }

            console.log(`Extracted season ${season_number} and episode ${episode_number} from title: ${title}`);

            // Verificar se a temporada já existe no banco de dados
            let season = await Season.findOne({
              where: { series_tmdb_id: seriesData.id, season_number },
            });

            if (!season) {
              // Se a temporada não existir, buscar detalhes da temporada no TMDB
              const seasonResponse = await axios.get(
                `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season_number}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
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

            // Verificar se o episódio já existe no banco de dados
            const existingEpisode = await Episode.findOne({
              where: { season_id: season.id, episode_number },
            });

            if (existingEpisode) {
              console.log(`Episode ${existingEpisode.name} already exists. Skipping...`);
              continue; // Ignorar se o episódio já existir
            }

            // Buscar detalhes do episódio no TMDB
            const episodeResponse = await axios.get(
              `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season_number}/episode/${episode_number}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
            );
            const episodeData = episodeResponse.data;

            // Criar o episódio no banco de dados
            // No seu controlador já atualizado:
            const episode = await Episode.create({
              name: episodeData.name,
              overview: episodeData.overview,
              season_id: season.id,
              episode_number,
              vote_average: episodeData.vote_average,
              runtime: episodeData.runtime,
              air_date: episodeData.air_date,
              production_code: episodeData.production_code,
              still_path: episodeData.still_path,
              guest_stars: episodeData.guest_stars,
              crew: episodeData.crew,
              link,
            });


            console.log(`Episode ${episode.name} saved with link: ${link}`);
          }
        } catch (error) {
          console.error(`Error processing folder with tmdb_id ${tmdb_id}:`, error.message);
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
