"use client";
import { Loader2, Send, Mail, MessageSquare, User, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contect = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send message. Please try again.");
        return;
      }

      toast.success("Message transmitted! Our team will respond shortly.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" /> Direct Candidate Support
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Get In Touch With Our Engineering Team
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Questions about voice calibration, company-specific tracks, or custom interview rubrics? Send us a note.
        </p>
      </div>

      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl text-left">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Your Full Name
              </Label>
              <Input
                id="contact-name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" /> Email Address
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-message" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Your Message
            </Label>
            <Textarea
              id="contact-message"
              placeholder="How can we help you?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 rounded-xl resize-none"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Transmitting Message...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Message
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contect;
