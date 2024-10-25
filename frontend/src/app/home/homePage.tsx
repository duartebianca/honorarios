import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input, Box, Text, Heading } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';

// Definindo o esquema de validação Zod
const schema = z.object({
  beneficiario: z.string().nonempty('Beneficiário é obrigatório'),
  nomeCliente: z.string().nonempty('Nome do cliente é obrigatório'),
  cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
  endereco: z.string().nonempty('Endereço é obrigatório'),
  cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
  numeroContrato: z.string().nonempty('Número do contrato é obrigatório'),
  parcelas: z.string().transform((val) => parseInt(val, 10)).refine(val => !isNaN(val) && val > 0, { message: 'Deve haver ao menos uma parcela' }),
  valor: z.string().transform((val) => parseFloat(val)).refine(val => val >= 0, { message: 'O valor deve ser positivo' }),
  data: z.string().nonempty('Data é obrigatória'),
  telefone: z.string().nonempty('Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  oab: z.string().nonempty('OAB é obrigatório'),
});
// Tipando o formulário baseado no esquema Zod
type FormData = z.infer<typeof schema>;

const Formulario = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [advogados, setAdvogados] = useState([]);

  useEffect(() => {
    // Carregar advogados do backend
    const fetchAdvogados = async () => {
      const response = await fetch('http://localhost:5000/api/advogados');
      const data = await response.json();
      console.log(data);
      setAdvogados(data);
    };

    fetchAdvogados();
  }, []);

  const handleAdvogadoChange = (event) => {
    const selectedAdvogado = advogados.find(adv => adv.beneficiario === event.target.value);
    if (selectedAdvogado) {
      // Preencher os campos automaticamente com os dados do advogado selecionado
      setValue('beneficiario', selectedAdvogado.beneficiario);
      setValue('telefone', selectedAdvogado.telefone);
      setValue('email', selectedAdvogado.email);
      setValue('cpf', selectedAdvogado.cpf);
      setValue('oab', selectedAdvogado.oab);
    }
  };

  const onSubmit = async (data: FormData) => {
    const response = await fetch('http://localhost:5000/api/gerar-recibo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const fileBlob = await response.blob();
    const url = window.URL.createObjectURL(fileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Recibo de Honorários - ${data.numeroContrato}.docx`;
    a.click();
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} maxW="500px" mx="auto" mt="20px">
      <Heading mb="2"> Gerador de Recibo de Honorários </Heading>
      <Box mb="4">
        <Select placeholder="Selecione o beneficiário" onChange={handleAdvogadoChange}>
          {advogados.map(adv => (
            <option key={adv.beneficiario} value={adv.beneficiario}>
              {adv.beneficiario}
            </option>
          ))}
        </Select>
        {errors.beneficiario?.message && <Text color="red.500" fontSize="sm">{errors.beneficiario.message.toString()}</Text>}
      </Box>

      <Box mb="4">
        <Input placeholder="Nome do Cliente" {...register('nomeCliente')} />
        {errors.nomeCliente?.message && <Text color="red.500" fontSize="sm">{errors.nomeCliente.message.toString()}</Text>}
      </Box>

      <Box mb="4">
        <Input placeholder="CNPJ" {...register('cnpj')} />
        {errors.cnpj?.message && <Text color="red.500" fontSize="sm">{errors.cnpj.message.toString()}</Text>}
      </Box>

      <Box mb="4">
        <Input placeholder="Endereço" {...register('endereco')} />
        {errors.endereco?.message && <Text color="red.500" fontSize="sm">{errors.endereco.message.toString()}</Text>}
      </Box>

      <Box mb="4">
        <Input placeholder="CEP" {...register('cep')} />
        {errors.cep?.message && <Text color="red.500" fontSize="sm">{errors.cep.message.toString()}</Text>}
      </Box>

      <Box mb="4">
        <Input placeholder="Número do Contrato" {...register('numeroContrato')} />
        {errors.numeroContrato?.message && <Text color="red.500" fontSize="sm">{errors.numeroContrato.message.toString()}</Text>}
      </Box>

      <Box mb="4">
        <Input type="number" placeholder="Parcelas" {...register('parcelas')} />
        {errors.parcelas?.message && <Text color="red.500" fontSize="sm">{errors.parcelas.message.toString()}</Text>}
      </Box>

      <Box mb="4">
        <Input type="number" placeholder="Valor" {...register('valor')} />
        {errors.valor?.message && <Text color="red.500" fontSize="sm">{errors.valor.message.toString()}</Text>}
      </Box>

      <Box mb="4">
        <Input type="date" placeholder="Data" {...register('data')} />
        {errors.data?.message && <Text color="red.500" fontSize="sm">{errors.data.message.toString()}</Text>}
      </Box>

      <Button mt="20px" type="submit" colorScheme="teal">
        Gerar Recibo
      </Button>
    </Box>
  );
};

export default Formulario;
