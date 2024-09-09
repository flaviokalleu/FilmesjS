// src/components/FetchSeriesFiles.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FetchSeriesFiles = () => {
  const [loading, setLoading] = useState(false);

  const handleFetchAndSave = async () => {
    console.log('Iniciando a busca e salvamento dos arquivos de séries...');
    setLoading(true); // Inicia o carregamento
    try {
      // Certifique-se de que a URL está correta, use o método POST
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/series/fetch-and-save-files`);
      console.log('Resposta recebida do servidor:', response.data);
      alert(response.data.message); // Exibe a mensagem de resposta
    } catch (error) {
      console.error('Erro ao buscar e salvar arquivos de séries:', error);
      if (error.response) {
        console.error('Dados de resposta do erro:', error.response.data);
      }
      alert('Erro ao buscar e salvar arquivos de séries');
    } finally {
      setLoading(false); // Para o carregamento
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Atualizar Arquivos de Séries</h1>
      <button
        onClick={handleFetchAndSave}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={loading} // Desabilita o botão enquanto carrega
        aria-label="Buscar e Salvar Séries"
      >
        {loading ? 'Carregando...' : 'Buscar e Salvar Séries'}
      </button>
    </div>
  );
};

export default FetchSeriesFiles;
