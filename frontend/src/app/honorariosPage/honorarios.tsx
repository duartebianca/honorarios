import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input, FormLabel, Select, Box } from '@chakra-ui/react';

// Definindo o esquema de validação Zod
const schema = z.object({
  beneficiario: z.string().nonempty('Beneficiário é obrigatório'),
  nomeCliente: z.string().nonempty('Nome do cliente é obrigatório'),
  cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
  endereco: z.string().nonempty('Endereço é obrigatório'),
  cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
  numeroContrato: z.string().nonempty('Número do contrato é obrigatório'),
  parcelas: z.number().min(1, 'Deve haver ao menos uma parcela'),
  valor: z.number().min(0, 'O valor deve ser positivo'),
  data: z.string().nonempty('Data é obrigatória'),
});

const Formulario = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const response = await fetch('/api/gerar-recibo', {
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
      <FormLabel>Beneficiário</FormLabel>
      <Select placeholder="Selecione o beneficiário" {...register('beneficiario')}>
        <option value="Advogado 1">Advogado 1</option>
        <option value="Advogado 2">Advogado 2</option>
      </Select>
      {errors.beneficiario && <span>{errors.beneficiario.message}</span>}
      
      <FormLabel>Nome do Cliente</FormLabel>
      <Input {...register('nomeCliente')} />
      {errors.nomeCliente && <span>{errors.nomeCliente.message}</span>}

      <FormLabel>CNPJ</FormLabel>
      <Input {...register('cnpj')} />
      {errors.cnpj && <span>{errors.cnpj.message}</span>}

      <FormLabel>Endereço</FormLabel>
      <Input {...register('endereco')} />
      {errors.endereco && <span>{errors.endereco.message}</span>}

      <FormLabel>CEP</FormLabel>
      <Input {...register('cep')} />
      {errors.cep && <span>{errors.cep.message}</span>}

      <FormLabel>Número do Contrato</FormLabel>
      <Input {...register('numeroContrato')} />
      {errors.numeroContrato && <span>{errors.numeroContrato.message}</span>}

      <FormLabel>Parcelas</FormLabel>
      <Input type="number" {...register('parcelas')} />
      {errors.parcelas && <span>{errors.parcelas.message}</span>}

      <FormLabel>Valor</FormLabel>
      <Input type="number" {...register('valor')} />
      {errors.valor && <span>{errors.valor.message}</span>}

      <FormLabel>Data</FormLabel>
      <Input type="date" {...register('data')} />
      {errors.data && <span>{errors.data.message}</span>}

      <Button mt="20px" type="submit" colorScheme="teal">
        Gerar Recibo
      </Button>
    </Box>
  );
};

export default Formulario;
