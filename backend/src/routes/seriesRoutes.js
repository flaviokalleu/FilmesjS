const express = require('express');
const router = express.Router();
const SeriesController = require('../controllers/SeriesController');
const SeriesFileController = require('../controllers/SeriesFileController');
const { Series, Season, Episode } = require('../models');

// Rotas para as séries
router.get('/', SeriesController.list);
router.post('/', SeriesController.create);
router.get('/:tmdb_id', SeriesController.getById);
router.put('/:tmdb_id', SeriesController.update);
router.delete('/:tmdb_id', SeriesController.delete);

// Rota para buscar e salvar arquivos das séries
router.post('/fetch-and-save-files', SeriesFileController.fetchAndSaveSeriesFiles);

// Rota para buscar uma série pelo tmdb_id
router.get('/tmdb/:tmdb_id', async (req, res) => {
    const { tmdb_id } = req.params;

    if (!tmdb_id) {
        return res.status(400).json({ error: 'tmdb_id não fornecido.' });
    }

    try {
        const series = await Series.findOne({ where: { tmdb_id } });
        if (!series) {
            return res.status(404).json({ error: 'Série não encontrada.' });
        }
        res.json(series);
    } catch (error) {
        console.error('Erro ao buscar série:', error);
        res.status(500).json({ error: 'Erro ao buscar série' });
    }
});

// Rota para buscar temporadas de uma série
router.get('/seasons/:tmdb_id', async (req, res) => {
    const { tmdb_id } = req.params;

    if (!tmdb_id) {
        return res.status(400).json({ error: 'tmdb_id não fornecido.' });
    }

    try {
        const seasons = await Season.findAll({ where: { series_tmdb_id: tmdb_id } });
        if (!seasons.length) {
            return res.status(404).json({ error: 'Temporadas não encontradas para este tmdb_id.' });
        }
        res.json(seasons);
    } catch (error) {
        console.error('Erro ao buscar temporadas:', error);
        res.status(500).json({ error: 'Erro ao buscar temporadas' });
    }
});

// Rota para buscar episódios de uma temporada
router.get('/seasons/:season_id/episodes', async (req, res) => {
    const { season_id } = req.params;

    if (!season_id) {
        return res.status(400).json({ error: 'season_id não fornecido.' });
    }

    try {
        // Busque os episódios da temporada no banco de dados usando o season_id
        const episodes = await Episode.findAll({ where: { season_id } });
        if (!episodes.length) {
            return res.status(404).json({ error: 'Episódios não encontrados para este season_id.' });
        }
        res.json(episodes);
    } catch (error) {
        console.error('Erro ao buscar episódios:', error);
        res.status(500).json({ error: 'Erro ao buscar episódios' });
    }
});

module.exports = router;
