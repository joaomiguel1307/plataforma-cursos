const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  "https://nydgcbmfvoszchuixaml.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_oToiwlSVBej_zb4ht0_Z3w_RHMDrwgK";

module.exports = async function handler(req, res) {
  // Aceita somente GET
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return res.status(405).json({
      error: "Método não permitido."
    });
  }

  try {
    const params = new URLSearchParams({
      select:
        "id,slug,title,description,trilha,cover_url,order_index",
      published: "eq.true",
      order: "order_index.asc"
    });

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/courses?${params.toString()}`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Accept: "application/json"
        }
      }
    );

    const text = await response.text();

    let data;

    try {
      data = text ? JSON.parse(text) : [];
    } catch {
      data = [];
    }

    if (!response.ok) {
      console.error(
        "Erro do Supabase:",
        response.status,
        data
      );

      return res.status(502).json({
        error: "Não foi possível carregar os cursos.",
        code: "SUPABASE_ERROR"
      });
    }

    return res.status(200).json({
      courses: Array.isArray(data) ? data : []
    });

  } catch (error) {

    console.error(
      "Erro na API de cursos:",
      error
    );

    return res.status(500).json({
      error: "Erro interno ao carregar os cursos.",
      code: "COURSES_API_ERROR"
    });
  }
};
