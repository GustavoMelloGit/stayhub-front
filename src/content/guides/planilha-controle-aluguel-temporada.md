---
slug: planilha-controle-aluguel-temporada
title: Planilha de controle de aluguel por temporada: o que ela precisa ter
description: A estrutura mínima de colunas e abas para controlar reservas e despesas de imóveis de temporada, os erros de montagem que distorcem o resultado e os limites da planilha.
updatedAt: 2026-08-29
query: planilha de controle de aluguel por temporada
---

Uma planilha resolve o controle de um imóvel de temporada muito melhor do que não ter nada, e melhor do que a maioria das pessoas imagina. O que ela pede em troca é disciplina: **ela só está certa enquanto alguém a alimenta**.

Este guia mostra a estrutura mínima que funciona, os erros de montagem que fazem o resultado mentir, e onde a planilha deixa de dar conta.

## As três abas que bastam

Muita planilha morre por excesso de ambição. Três abas resolvem o problema real.

### Aba 1: Reservas

Uma linha por reserva. Colunas mínimas:

| Coluna                  | Por que existe                                    |
| ----------------------- | ------------------------------------------------- |
| Imóvel                  | Sem ela você não consegue olhar imóvel por imóvel |
| Check-in e check-out    | Definem a que mês a receita pertence              |
| Noites                  | Base de todo cálculo por noite                    |
| Canal                   | Airbnb, Booking, direto, indicação                |
| Valor das diárias       | O que o hóspede pagou pelas noites                |
| Taxa de limpeza cobrada | Separada, porque ela sai de novo como despesa     |
| Taxa do canal           | O que a plataforma reteve                         |
| Valor recebido          | O que caiu na conta                               |

### Aba 2: Despesas

Uma linha por despesa. Colunas mínimas:

| Coluna     | Por que existe                                                      |
| ---------- | ------------------------------------------------------------------- |
| Data       | Do fato, não do pagamento                                           |
| Imóvel     | Ou "todos", para rateio                                             |
| Categoria  | Limpeza, consumível, manutenção, condomínio, IPTU, internet, seguro |
| Tipo       | Fixa ou variável                                                    |
| Valor      |                                                                     |
| Observação | Para você lembrar em dezembro o que foi aquilo em março             |

### Aba 3: Resumo

Nada digitado à mão. Só fórmulas que puxam das duas primeiras: receita, despesa e lucro por imóvel e por mês.

## Os quatro erros de montagem

Estes são os que fazem a planilha dar um número errado com cara de número certo.

**Somar pela data da reserva, não pela da estadia.** Uma reserva feita em setembro para dezembro é receita de dezembro. Quem soma pela data em que a reserva entrou vê a alta temporada fraca e a baixa forte, e conclui coisas erradas sobre preço.

**Registrar só o valor que caiu na conta.** O depósito da plataforma já vem com a taxa descontada. Se você anota só ele, a taxa some da planilha e você nunca sabe quanto o canal custou. Registre o valor cheio e a taxa como despesa.

**Misturar taxa de limpeza cobrada com lucro.** Ela precisa aparecer nas duas pontas, cobrada na receita e paga na despesa. Se aparece só de um lado, o mês inteiro fica torto. O mecanismo está detalhado no [guia de taxa de limpeza](/guias/taxa-de-limpeza-quanto-cobrar).

**Não separar despesa fixa de variável.** Sem essa coluna você não consegue calcular o custo de uma noite ocupada, que é o piso do seu preço. Condomínio e IPTU correm com o imóvel vazio; limpeza e consumível não.

## O que o resumo precisa responder

Se a sua aba de resumo não responde estas cinco perguntas, ela está incompleta:

1. Quanto cada imóvel deu de lucro neste mês.
2. Quanto cada imóvel deu de lucro nos últimos doze meses.
3. Quanto sobrou por noite ocupada, por imóvel.
4. Qual canal está rendendo mais, líquido.
5. Quanto do ano ainda está em aberto no calendário.

As três primeiras dependem da estrutura acima. A quarta é a comparação do [guia de canais](/guias/airbnb-ou-booking-qual-vale-mais). A quinta é a que quase nenhuma planilha tem, e é a que mais muda decisão, porque é a única que olha para frente.

## Um cuidado com fórmula

Planilha compartilhada quebra em silêncio. As causas mais comuns:

- Alguém insere linha no meio e a fórmula do resumo não estende o intervalo.
- Nome de imóvel digitado de dois jeitos ("Apto 302" e "Apto 302 "). O `SOMASE` trata como dois imóveis.
- Data em formato texto, que não entra em nenhum filtro de período.
- Cópia de mês que arrasta referência e passa a somar o mês anterior.

Nenhum desses dá erro visível. Eles dão um número plausível e errado, que é bem pior. Use lista suspensa para imóvel e categoria, e confira o total de um mês na mão pelo menos uma vez por trimestre.

## Onde a planilha para de servir

A planilha é ótima até três coisas acontecerem ao mesmo tempo.

**Mais de dois ou três imóveis.** O trabalho de lançamento cresce em linha reta com o número de imóveis, e o tempo que você tem não cresce.

**Lançamento fora da mesa.** A despesa acontece na loja de material, no corredor do prédio, no WhatsApp da diarista. A planilha está no computador. O intervalo entre o fato e o lançamento é onde a informação se perde, e ela se perde inteira: você não lança pela metade, você não lança.

**Mais de uma pessoa mexendo.** Cônjuge, sócio, quem administra. Cada um preenche de um jeito e a coluna de categoria vira texto livre em dois meses.

Quando os três aparecem juntos, o problema deixa de ser a planilha e passa a ser o hábito de alimentar a planilha. Nenhuma coluna nova resolve isso.

## Como saber que chegou a hora de sair

Três sinais objetivos:

- Você está lançando com mais de uma semana de atraso, de forma recorrente.
- Você já deixou de lançar alguma coisa porque não lembrava do valor.
- Você evita abrir a planilha porque sabe que ela está desatualizada.

O terceiro é o mais grave, porque é quando a planilha para de ser ferramenta de decisão e vira dívida.

Se você reconheceu algum dos três, o [comparativo de alternativas à planilha](/guias/alternativa-a-planilha-de-temporada) mostra as cinco saídas possíveis e para qual problema cada uma serve.

## A alternativa

Sogio existe exatamente para essa parte. O cálculo continua sendo o mesmo deste guia: a diferença é que o lançamento acontece no momento em que o fato acontece, falando.

Você manda um áudio dizendo que pagou a diarista, ou a foto da nota do material, e a despesa entra no imóvel e no mês certos. Quando quiser o número, você pergunta e a resposta vem pronta, sem você abrir nada.
