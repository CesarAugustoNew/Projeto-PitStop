// Nomes vindos do banco (ex.: LAVAGEM_COMPLETA) viram texto legível.
const ACENTOS = {
  HIGIENIZACAO: 'Higienização',
  CRISTALIZACAO: 'Cristalização',
  VITRIFICACAO: 'Vitrificação',
  HIDRATACAO: 'Hidratação',
};

export const formatarEnum = (valor) => {
  if (!valor) return '—';
  const chave = String(valor).toUpperCase();
  if (ACENTOS[chave]) return ACENTOS[chave];
  return String(valor)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
};

/*
  Identifica o erro que o back-end devolve quando o registro não pode ser
  apagado por estar ligado a outros (violação de chave estrangeira).
  Cobre o status 409 e as mensagens típicas do Postgres/Hibernate; um 500
  genérico numa exclusão quase sempre é esse caso.
*/
export const isErroDeVinculo = (err) => {
  if (!err) return false;
  if (err.status === 409) return true;
  const msg = String(err.message || '').toLowerCase();
  if (/constraint|foreign key|violat|integrity|referenc|vincul|still referenced/.test(msg)) return true;
  return err.status === 500;
};
