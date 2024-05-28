document.getElementById('cep').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        consultaEndereco();
    }
});

let enderecoAtual = {}; 

document.addEventListener('DOMContentLoaded', carregaEndereços);

function consultaEndereco() {
    const cep = document.querySelector('#cep').value;

    if (cep.length !== 8) {
        alert('CEP inválido');
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;
    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Erro na consulta do CEP');
            }
            return response.json();
        })
        .then(mostrarEndereco)
        .catch(function(error) {
            console.error('Erro na consulta do CEP:', error);
            const resultado = document.querySelector('#resultado');
            resultado.innerHTML = `<p>Erro na consulta do CEP: ${error.message}</p>`;
        });
}

function mostrarEndereco(dados) {
    const resultado = document.querySelector('#resultado');
    if (dados.erro) {
        resultado.innerHTML = `<p>CEP não encontrado</p>`;
    } else {
        enderecoAtual = dados; // Armazena os dados do endereço atual
        resultado.innerHTML = `
            <p>Endereço: ${dados.logradouro || ''}</p>
            <p>Complemento: ${dados.complemento || ''}</p>
            <p>Bairro: ${dados.bairro || ''}</p>
            <p>Cidade: ${dados.localidade || ''}</p>
            <p>UF: ${dados.uf || ''}</p>
            <p>IBGE: ${dados.ibge || ''}</p>
            <p>GIA: ${dados.gia || ''}</p>
            <p>DDD: ${dados.ddd || ''}</p>
            <p>SIAFI: ${dados.siafi || ''}</p>
        `;
    }
}

function salvarEndereco() {
    if (!enderecoAtual || !enderecoAtual.logradouro) {
        alert('Nenhum endereço para salvar. Faça a consulta primeiro.');
        return;
    }

    const tabela = document.querySelector('#tabela');
    const novaLinha = `
        <tr>
            <td>${enderecoAtual.logradouro || ''}</td>
            <td>${enderecoAtual.complemento || ''}</td>
            <td>${enderecoAtual.bairro || ''}</td>
            <td>${enderecoAtual.localidade || ''}</td>
            <td>${enderecoAtual.uf || ''}</td>
            <td>${enderecoAtual.ibge || ''}</td>
            <td>${enderecoAtual.gia || ''}</td>
            <td>${enderecoAtual.ddd || ''}</td>
            <td>${enderecoAtual.siafi || ''}</td>
        </tr>
    `;
    tabela.insertAdjacentHTML('beforeend', novaLinha);

    salvarendereçolocalstorage(enderecoAtual);

    document.querySelector('#resultado').innerHTML = '<p>Seu resultado aqui</p>';
    enderecoAtual = {}; 
}

function salvarendereçolocalstorage(endereço) {
    let endereços=JSON.parse(localStorage.getItem('endereços')) || [];
    endereços.push(endereço);
    localStorage.setItem('endereços', JSON.stringify(endereços));
}

function carregaEndereços() {
    const tabela = document.querySelector('#tabela');
    const endereços=JSON.parse(localStorage.getItem('endereços')) || [];
    endereços.forEach(endereço => {
        const novaLinha = `
        <tr>
        <td>${endereço.logradouro || ''}</td>
        <td>${endereço.complemento || ''}</td>
        <td>${endereço.bairro || ''}</td>
        <td>${endereço.localidade || ''}</td>
        <td>${endereço.uf || ''}</td>
        <td>${endereço.ibge || ''}</td>
        <td>${endereço.gia || ''}</td>
        <td>${endereço.ddd || ''}</td>
        <td>${endereço.siafi || ''}</td>
        </tr>
        `;
        tabela.insertAdjacentHTML('beforeend', novaLinha);
        });
}
