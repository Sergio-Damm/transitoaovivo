import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import re
import os

# Caminho de saída dos arquivos JSON (onde o GitHub Actions irá salvá-los)
# Certifique-se de que este caminho corresponde ao caminho no seu workflow!
OUTPUT_DIR = os.path.join('assets', 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True) # Garante que a pasta exista

def scrape_cetsp():
    url = "http://www.cetsp.com.br/transito-agora/mapa/zona-sul.aspx" # URL base para o scraping da CET-SP
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
        "dataHora": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() # Lança um erro para status de erro HTTP
        soup = BeautifulSoup(response.text, 'html.parser')

        # Regex para encontrar os dados de lentidão
        pattern = re.compile(r"mapa\.Lentidao\[\"(\w+)\"\] = (\d+\.?\d*);")
        
        script_tags = soup.find_all('script', string=pattern)
        
        current_total_lentidao = 0
        if script_tags:
            for script_tag in script_tags:
                for line in script_tag.string.split(';'):
                    match = pattern.search(line)
                    if match:
                        region = match.group(1).lower()
                        lentidao = float(match.group(2))
                        
                        if region in data["regioes"]:
                            data["regioes"][region] = lentidao
                            current_total_lentidao += lentidao
            data["total"] = round(current_total_lentidao, 2) # Arredonda para 2 casas decimais

    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição CET-SP: {e}")
    except Exception as e:
        print(f"Erro ao processar dados da CET-SP: {e}")
        
    return data

def scrape_artesp():
    url = "http://www.artesp.sp.gov.br/transporte/rodovias/mapa.html"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    
    data = {
        "rodovias": [],
        "dataHora": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        linhas = soup.select('div.col-md-6 table.table.table-striped tbody tr')
        
        for linha in linhas:
            colunas = linha.find_all('td')
            if len(colunas) == 2:
                rodovia_nome = colunas[0].get_text(strip=True)
                condicao = colunas[1].get_text(strip=True)
                data["rodovias"].append({
                    "nome": rodovia_nome,
                    "condicao": condicao
                })

    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição Artesp: {e}")
    except Exception as e:
        print(f"Erro ao processar dados da Artesp: {e}")

    return data

if __name__ == "__main__":
    # Scrape CET-SP
    cetsp_data = scrape_cetsp()
    with open(os.path.join(OUTPUT_DIR, 'trafego_cetsp.json'), 'w', encoding='utf-8') as f:
        json.dump(cetsp_data, f, ensure_ascii=False, indent=4)
    print(f"Dados CET-SP salvos em {os.path.join(OUTPUT_DIR, 'trafego_cetsp.json')}")

    # Scrape Artesp
    artesp_data = scrape_artesp()
    with open(os.path.join(OUTPUT_DIR, 'trafego_artesp.json'), 'w', encoding='utf-8') as f:
        json.dump(artesp_data, f, ensure_ascii=False, indent=4)
    print(f"Dados Artesp salvos em {os.path.join(OUTPUT_DIR, 'trafego_artesp.json')}")