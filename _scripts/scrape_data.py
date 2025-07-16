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
    # A URL principal da CET-SP agora exibe o resumo do tráfego
    url = "https://www.cetsp.com.br" # A URL principal
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
        "dataHora": datetime.now(BRASILIA_TZ).strftime("%Y-%m-%d %H:%M:%S")
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() # Lança um erro para status de erro HTTP
        soup = BeautifulSoup(response.text, 'html.parser')

        # Adaptação do seu código Node.js/Cheerio para Python/BeautifulSoup
        # Seleciona a div com classe 'info' dentro de uma 'boxZona' e então o h4 dentro dela
        data["regioes"]["norte"] = int(soup.select_one('.info.norte h4').get_text(strip=True).replace(' km', '')) if soup.select_one('.info.norte h4') else 0
        data["regioes"]["oeste"] = int(soup.select_one('.info.oeste h4').get_text(strip=True).replace(' km', '')) if soup.select_one('.info.oeste h4') else 0
        data["regioes"]["centro"] = int(soup.select_one('.info.centro h4').get_text(strip=True).replace(' km', '')) if soup.select_one('.info.centro h4') else 0
        data["regioes"]["leste"] = int(soup.select_one('.info.leste h4').get_text(strip=True).replace(' km', '')) if soup.select_one('.info.leste h4') else 0
        data["regioes"]["sul"] = int(soup.select_one('.info.sul h4').get_text(strip=True).replace(' km', '')) if soup.select_one('.info.sul h4') else 0
        
        # Calcula o total
        data["total"] = sum(data["regioes"].values())

    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição CET-SP: {e}")
    except AttributeError: # Captura erro se o seletor não encontrar o elemento (ex: .select_one retorna None)
        print("Não foi possível encontrar os elementos de lentidão da CET-SP com os seletores atuais. Estrutura HTML pode ter mudado.")
    except ValueError: # Captura erro se a conversão para int falhar (ex: " km" não foi removido)
        print("Erro ao converter km para número na CET-SP. Formato pode ter mudado.")
    except Exception as e:
        print(f"Erro inesperado ao processar dados da CET-SP: {e}")
        
    return data

def scrape_artesp():
    url = "https://cci.artesp.sp.gov.br/"
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
    # artesp_data = scrape_artesp()
    # artesp_file_path = os.path.join(OUTPUT_DIR, 'trafego_artesp.json')
    # with open(artesp_file_path, 'w', encoding='utf-8') as f:
    #   json.dump(artesp_data, f, ensure_ascii=False, indent=4)
    # print(f"Dados Artesp salvos em {artesp_file_path}. Conteúdo: {json.dumps(artesp_data)}") # Imprime o conteúdo