import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import pytz # Importação da biblioteca pytz para fusos horários
import re
import os

# Caminho de saída dos arquivos JSON (onde o GitHub Actions irá salvá-los)
# Certifique-se de que este caminho corresponde ao caminho no seu workflow: assets/data
OUTPUT_DIR = os.path.join('assets', 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True) # Garante que a pasta exista

# Define o fuso horário de Brasília
BRASILIA_TZ = pytz.timezone('America/Sao_Paulo')

def scrape_cetsp():
    # URL base para o scraping da CET-SP (página da zona sul, que contém o JS com os totais)
    url = "http://www.cetsp.com.br/transito-agora/mapa/zona-sul.aspx"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    
    data = {
        "total": 0,
        "regioes": {
            "norte": 0,
            "oeste": 0,
            "centro": 0,
            "leste": 0,
            "sul": 0
        },
        "dataHora": datetime.now(BRASILIA_TZ).strftime("%Y-%m-%d %H:%M:%S") # Data/hora em Brasília
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() # Lança um erro para status de erro HTTP (ex: 404, 500)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Regex para encontrar os dados de lentidão nas tags <script>
        # Procura por linhas como: mapa.Lentidao["Norte"] = 10.5;
        pattern = re.compile(r"mapa\.Lentidao\[\"(\w+)\"\] = (\d+\.?\d*);")
        
        script_tags = soup.find_all('script', string=pattern) # Encontra todas as tags script que contêm o padrão
        
        current_total_lentidao = 0.0 # Usar float para somas de km
        if script_tags:
            for script_tag in script_tags:
                for line in script_tag.string.split(';'):
                    match = pattern.search(line)
                    if match:
                        region = match.group(1).lower() # Converte para minúsculas (norte, sul, etc.)
                        lentidao = float(match.group(2)) # Converte para float
                        
                        if region in data["regioes"]: # Verifica se a região é uma das esperadas
                            data["regioes"][region] = lentidao
                            current_total_lentidao += lentidao
            data["total"] = round(current_total_lentidao, 2) # Arredonda o total para 2 casas decimais

    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição CET-SP: {e}")
        # Em caso de erro, os dados permanecerão zerados (como inicializados)
    except Exception as e:
        print(f"Erro inesperado ao processar dados da CET-SP: {e}")
        # Em caso de erro, os dados permanecerão zerados (como inicializados)
        
    return data

def scrape_artesp():
    url = "http://www.artesp.sp.gov.br/transporte/rodovias/mapa.html"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    
    data = {
        "rodovias": [],
        "dataHora": datetime.now(BRASILIA_TZ).strftime("%Y-%m-%d %H:%M:%S") # Data/hora em Brasília
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Seleciona as linhas da tabela de rodovias
        linhas = soup.select('div.col-md-6 table.table.table-striped tbody tr')
        
        for linha in linhas:
            colunas = linha.find_all('td')
            if len(colunas) == 2: # Espera duas colunas (Nome da Rodovia, Condição)
                rodovia_nome = colunas[0].get_text(strip=True) # Nome da rodovia
                condicao = colunas[1].get_text(strip=True) # Condição (Tráfego Normal, Lentidão, etc.)
                data["rodovias"].append({
                    "nome": rodovia_nome,
                    "condicao": condicao
                })

    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição Artesp: {e}")
        # Em caso de erro, a lista de rodovias permanecerá vazia
    except Exception as e:
        print(f"Erro inesperado ao processar dados da Artesp: {e}")
        # Em caso de erro, a lista de rodovias permanecerá vazia

    return data

if __name__ == "__main__":
    print(f"Iniciando scraping de dados de tráfego em: {datetime.now(BRASILIA_TZ).strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Scrape CET-SP
    cetsp_data = scrape_cetsp()
    cetsp_file_path = os.path.join(OUTPUT_DIR, 'trafego_cetsp.json')
    with open(cetsp_file_path, 'w', encoding='utf-8') as f:
        json.dump(cetsp_data, f, ensure_ascii=False, indent=4)
    print(f"Dados CET-SP salvos em {cetsp_file_path}. Conteúdo: {json.dumps(cetsp_data)}") # Imprime o conteúdo

    # Scrape Artesp
    artesp_data = scrape_artesp()
    artesp_file_path = os.path.join(OUTPUT_DIR, 'trafego_artesp.json')
    with open(artesp_file_path, 'w', encoding='utf-8') as f:
        json.dump(artesp_data, f, ensure_ascii=False, indent=4)
    print(f"Dados Artesp salvos em {artesp_file_path}. Conteúdo: {json.dumps(artesp_data)}") # Imprime o conteúdo