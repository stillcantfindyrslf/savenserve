import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { Resend } from "https://esm.sh/resend";
const supabase = createClient(Deno.env.get("_SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
serve(async ()=>{
  try {
    // Получаем пользователей, подписанных на рассылку
    const { data: users, error: userError } = await supabase.from("users").select("id, email").eq("is_subscribed", true);
    if (userError) throw userError;
    // Получаем товары, срок годности которых истекает через 5-1 дней
    const { data: items, error: itemsError } = await supabase.from("items").select("name, best_before").gte("best_before", new Date().toISOString()).lte("best_before", new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString());
    if (itemsError) throw itemsError;
    if (items.length === 0) {
      console.log("Нет товаров для отправки.");
      return new Response("No items to send.", {
        status: 200
      });
    }
    // Формируем список товаров
    const itemList = items.map((item)=>`- ${item.name} (до ${new Date(item.best_before).toLocaleDateString()})`).join("\n");
    // Отправляем email каждому подписанному пользователю
    for (const user of users){
      await resend.emails.send({
        from: "noreply@savenserve.ru",
        to: user.email,
        subject: "Товары с истекающим сроком годности",
        text: `Здравствуйте!\n\nВот список товаров, срок годности которых истекает:\n\n${itemList}\n\nС уважением, команда SaveNServe.`
      });
    }
    return new Response("Emails sent successfully.", {
      status: 200
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Error occurred.", {
      status: 500
    });
  }
});
