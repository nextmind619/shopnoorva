"use client";

import { useState } from "react";
import { Mail, MessageSquare, Smartphone, BarChart3 } from "lucide-react";

export default function AdminMarketingPage() {
  const [emailCampaign, setEmailCampaign] = useState({ subject: "", body: "" });
  const [smsText, setSmsText] = useState("");
  const [whatsappText, setWhatsappText] = useState("");

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Marketing</h1>
        <p className="text-neutral-500 text-sm mt-1">Email, SMS, WhatsApp campaigns & analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gold"><Mail className="h-5 w-5" /><h2 className="font-medium">Email</h2></div>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Subject" value={emailCampaign.subject} onChange={(e) => setEmailCampaign({ ...emailCampaign, subject: e.target.value })} />
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm h-32" placeholder="Email body..." value={emailCampaign.body} onChange={(e) => setEmailCampaign({ ...emailCampaign, body: e.target.value })} />
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">Send Campaign</button>
        </div>

        <div className="border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gold"><Smartphone className="h-5 w-5" /><h2 className="font-medium">SMS</h2></div>
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm h-32" placeholder="SMS message (160 chars)..." value={smsText} onChange={(e) => setSmsText(e.target.value)} maxLength={160} />
          <p className="text-xs text-neutral-400">{smsText.length}/160</p>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">Send SMS Blast</button>
        </div>

        <div className="border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gold"><MessageSquare className="h-5 w-5" /><h2 className="font-medium">WhatsApp</h2></div>
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm h-32" placeholder="WhatsApp broadcast message..." value={whatsappText} onChange={(e) => setWhatsappText(e.target.value)} />
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">Send via Evolution API</button>
        </div>

        <div className="border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gold"><BarChart3 className="h-5 w-5" /><h2 className="font-medium">Analytics</h2></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 rounded-lg p-4"><p className="text-xs text-neutral-500">Conversion Rate</p><p className="text-2xl font-semibold">4.2%</p></div>
            <div className="bg-neutral-50 rounded-lg p-4"><p className="text-xs text-neutral-500">AOV</p><p className="text-2xl font-semibold">168 MAD</p></div>
            <div className="bg-neutral-50 rounded-lg p-4"><p className="text-xs text-neutral-500">Orders Today</p><p className="text-2xl font-semibold">12</p></div>
            <div className="bg-neutral-50 rounded-lg p-4"><p className="text-xs text-neutral-500">Cart Recovery</p><p className="text-2xl font-semibold">18%</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
