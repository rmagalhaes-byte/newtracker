/**
 * Data.js - Base de dados local para o Hub de Progresso
 * Inserimos aqui os dados do CSV para evitar erros de carregamento (CORS) 
 * e permitir que a página funcione instantaneamente em qualquer lugar.
 */

const blockchainTasks = [
    { Tarefa: "Criar conta Instagram com bio + link WhatsApp", Fase: "Fase 1 — Fundação", Semana: "Semana 1", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Criar grupo WhatsApp com nome + regras + mensagem de boas-vindas", Fase: "Fase 1 — Fundação", Semana: "Semana 1", Canal: "WhatsApp", Status: "Por fazer", Notas: "" },
    { Tarefa: "Definir identidade visual no Canva (paleta + tipografia + templates)", Fase: "Fase 1 — Fundação", Semana: "Semana 1", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Auditoria ao website e LinkedIn existentes", Fase: "Fase 1 — Fundação", Semana: "Semana 1", Canal: "Website", Status: "Por fazer", Notas: "" },
    { Tarefa: "Contactar os primeiros 3 candidatos a speaker/entrevista", Fase: "Fase 1 — Fundação", Semana: "Semana 1", Canal: "Webinar", Status: "Por fazer", Notas: "" },
    { Tarefa: "Publicar os primeiros 3 posts no Instagram", Fase: "Fase 1 — Fundação", Semana: "Semana 2", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Gravar a 1.ª entrevista", Fase: "Fase 1 — Fundação", Semana: "Semana 2", Canal: "Podcast", Status: "Por fazer", Notas: "" },
    { Tarefa: "Configurar plataforma de podcast (Anchor ou Buzzsprout)", Fase: "Fase 1 — Fundação", Semana: "Semana 2", Canal: "Podcast", Status: "Por fazer", Notas: "" },
    { Tarefa: "Recrutar primeiros 10–15 membros WhatsApp via rede pessoal", Fase: "Fase 1 — Fundação", Semana: "Semana 2", Canal: "WhatsApp", Status: "Por fazer", Notas: "" },
    { Tarefa: "Confirmar pelo menos 1 speaker para o webinar", Fase: "Fase 1 — Fundação", Semana: "Semana 2", Canal: "Webinar", Status: "Por fazer", Notas: "" },
    { Tarefa: "3 posts Instagram — tema: identidade digital com blockchain", Fase: "Fase 2 — Crescimento", Semana: "Semana 3", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Gravar a 2.ª entrevista", Fase: "Fase 2 — Crescimento", Semana: "Semana 3", Canal: "Podcast", Status: "Por fazer", Notas: "" },
    { Tarefa: "Publicar 1 artigo no LinkedIn sobre a Portuguese Digital Wallet", Fase: "Fase 2 — Crescimento", Semana: "Semana 3", Canal: "LinkedIn", Status: "Por fazer", Notas: "" },
    { Tarefa: "Primeiro desafio ou pergunta na comunidade WhatsApp", Fase: "Fase 2 — Crescimento", Semana: "Semana 3", Canal: "WhatsApp", Status: "Por fazer", Notas: "" },
    { Tarefa: "Publicar episódio 1 do podcast", Fase: "Fase 2 — Crescimento", Semana: "Semana 4", Canal: "Podcast", Status: "Por fazer", Notas: "" },
    { Tarefa: "Anunciar o webinar no Instagram e no WhatsApp", Fase: "Fase 2 — Crescimento", Semana: "Semana 4", Canal: "Webinar", Status: "Por fazer", Notas: "" },
    { Tarefa: "Abrir página de registo do webinar no website", Fase: "Fase 2 — Crescimento", Semana: "Semana 4", Canal: "Website", Status: "Por fazer", Notas: "" },
    { Tarefa: "Gravar a 3.ª entrevista", Fase: "Fase 2 — Crescimento", Semana: "Semana 4", Canal: "Podcast", Status: "Por fazer", Notas: "" },
    { Tarefa: "Confirmar os 3 speakers do webinar", Fase: "Fase 2 — Crescimento", Semana: "Semana 4", Canal: "Webinar", Status: "Por fazer", Notas: "" },
    { Tarefa: "3 posts de contagem decrescente para o webinar", Fase: "Fase 2 — Crescimento", Semana: "Semana 5", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Publicar clips teaser com os speakers (30–60 seg.)", Fase: "Fase 2 — Crescimento", Semana: "Semana 5", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Enviar convite formal a professores e associações de TI", Fase: "Fase 2 — Crescimento", Semana: "Semana 5", Canal: "Webinar", Status: "Por fazer", Notas: "" },
    { Tarefa: "Gravar a 4.ª entrevista", Fase: "Fase 2 — Crescimento", Semana: "Semana 5", Canal: "Podcast", Status: "Por fazer", Notas: "" },
    { Tarefa: "Ensaio técnico com os 3 speakers", Fase: "Fase 3 — Evento", Semana: "Semana 6", Canal: "Webinar", Status: "Por fazer", Notas: "" },
    { Tarefa: "Publicar episódio 2 do podcast", Fase: "Fase 3 — Evento", Semana: "Semana 6", Canal: "Podcast", Status: "Por fazer", Notas: "" },
    { Tarefa: "Publicar programa completo do webinar", Fase: "Fase 3 — Evento", Semana: "Semana 6", Canal: "Website", Status: "Por fazer", Notas: "" },
    { Tarefa: "Push final de registos: Instagram + WhatsApp + LinkedIn", Fase: "Fase 3 — Evento", Semana: "Semana 6", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Realização do webinar (11 de junho)", Fase: "Fase 3 — Evento", Semana: "Semana 7", Canal: "Webinar", Status: "Por fazer", Notas: "" },
    { Tarefa: "Cobertura ao vivo no Instagram Stories", Fase: "Fase 3 — Evento", Semana: "Semana 7", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Publicar gravação no YouTube/LinkedIn", Fase: "Fase 3 — Evento", Semana: "Semana 7", Canal: "Website", Status: "Por fazer", Notas: "" },
    { Tarefa: "Clips dos melhores momentos nas redes", Fase: "Fase 3 — Evento", Semana: "Semana 7", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Follow-up WhatsApp: agradecimentos + próximos passos", Fase: "Fase 3 — Evento", Semana: "Semana 7", Canal: "WhatsApp", Status: "Por fazer", Notas: "" },
    { Tarefa: "Publicar destaques e agradecimentos do webinar", Fase: "Fase 4 — Consolidação", Semana: "Semana 8", Canal: "Instagram", Status: "Por fazer", Notas: "" },
    { Tarefa: "Gravar e publicar a 5.ª entrevista", Fase: "Fase 4 — Consolidação", Semana: "Semana 8", Canal: "Podcast", Status: "Por fazer", Notas: "" },
    { Tarefa: "Redigir relatório de resultados com KPIs", Fase: "Fase 4 — Consolidação", Semana: "Semana 8", Canal: "Website", Status: "Por fazer", Notas: "" },
    { Tarefa: "Preparar proposta de continuidade", Fase: "Fase 4 — Consolidação", Semana: "Semana 8", Canal: "Webinar", Status: "Por fazer", Notas: "" }
];
