from docxtpl import DocxTemplate

def gerar_recibo(data):
    # Carregar o modelo de documento
    try:
        doc = DocxTemplate('teste.docx')  # Certifique-se de que o caminho está correto
        print("Documento carregado com sucesso.")
    except Exception as e:
        raise FileNotFoundError(f'Erro ao carregar o documento: {str(e)}')

    # Definir os dados que serão inseridos nos placeholders do documento
    context = {
        'nome_advogado': data.get('beneficiario', ''),
        'oab': data.get('oab', ''),
        'cpf': data.get('cpf', ''),
        'nome_cliente': data.get('nomeCliente', ''),
        'cnpj': data.get('cnpj', ''),
        'endereco': data.get('endereco', '')
    }

    print("Contexto passado para o template:")
    for key, value in context.items():
        print(f"{key}: {value}")
    # Substituir os placeholders no template com os valores fornecidos
    doc.render(context)

    # Salvar o arquivo gerado
    output_filename = f"Recibo_de_Honorarios_{data.get('numeroContrato', 'Recibo')}.docx"
    doc.save(output_filename)
    
    print(f"Documento salvo: {output_filename}")

# Testando a função com um JSON mock
if __name__ == "__main__":
    # JSON falso simulando os dados enviados no formulário
    mock_data = {
        "numeroContrato": "0",
        "nomeCliente": "Maria da Silva",
        "cnpj": "00000000000000",
        "beneficiario": "João Silva",
        "endereco": "Rua Guaiajaras, 100, Centro, Belo Horizonte, MG",
        "oab": "12345",
        "cpf": "12345678901"
    }

    # Chamando a função de teste
    gerar_recibo(mock_data)
