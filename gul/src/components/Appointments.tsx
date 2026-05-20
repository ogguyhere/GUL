import React, { useState, useRef, useEffect } from "react";
import { UserAccount, Appointment, DirectMessage } from "../types";
import { Calendar, Clock, MessageSquare, Send, Sparkles, User, FileText, CheckCircle, ShieldAlert, BadgeInfo, Star } from "lucide-react";

interface AppointmentsProps {
  currentUser: UserAccount;
  accounts: UserAccount[];
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  directMessages: DirectMessage[];
  setDirectMessages: React.Dispatch<React.SetStateAction<DirectMessage[]>>;
  onDeductPoints: (amount: number) => boolean;
  onAddPoints: (amount: number) => void;
  onChallengeProgress: (type: "clipping" | "sharing" | "diagnosing" | "planting" | "purchasing", amount: number) => void;
}

export default function Appointments({
  currentUser,
  accounts,
  appointments,
  setAppointments,
  directMessages,
  setDirectMessages,
  onDeductPoints,
  onAddPoints,
  onChallengeProgress
}: AppointmentsProps) {
  const [selectedBotanist, setSelectedBotanist] = useState<UserAccount | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("09:00 AM - 10:00 AM");
  const [plantType, setPlantType] = useState("");
  const [symptoms, setSymptoms] = useState("");
  
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [errorText, setErrorText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const botanists = accounts.filter((a) => a.role === "botanist");

  // Get matching appointments for the current role
  const filteredAppointments = appointments.filter((app) => {
    if (currentUser.role === "customer") return app.customerId === currentUser.id;
    if (currentUser.role === "botanist") return app.botanistId === currentUser.id;
    return true; // admin sees all
  });

  const activeAppointment = appointments.find((a) => a.id === activeAppointmentId);
  const activeChatMessages = directMessages.filter((m) => m.appointmentId === activeAppointmentId);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatMessages]);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessMsg("");

    if (!selectedBotanist) {
      setErrorText("Please select a botanist to consult.");
      return;
    }
    if (!bookingDate || !plantType || !symptoms) {
      setErrorText("Please complete all fields.");
      return;
    }

    const fee = selectedBotanist.consultationFee || 30;

    // Try paying points
    const paymentSuccess = onDeductPoints(fee);
    if (!paymentSuccess) {
      setErrorText(`Failed to book slot. You need ${fee} GUL coins but you only have ${currentUser.points} PTS currently. Complete tasks in original Oasis to get more coins!`);
      return;
    }

    const newAppointment: Appointment = {
      id: `ap-${Date.now()}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      botanistId: selectedBotanist.id,
      botanistName: selectedBotanist.name,
      date: bookingDate,
      timeSlot: bookingSlot,
      plantType,
      symptoms,
      status: "scheduled"
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setSuccessMsg(`Congratulations! Your appointment with ${selectedBotanist.name} has been confirmed for ${bookingDate} at ${bookingSlot}. We deducted ${fee} PTS.`);
    
    // Add an initial greeting from the botanist in direct message threads
    const botanistGreeting: DirectMessage = {
      id: `msg-${Date.now()}`,
      appointmentId: newAppointment.id,
      senderId: selectedBotanist.id,
      senderName: selectedBotanist.name,
      text: `Hello ${currentUser.name}! I received your appointment booking regarding your "${plantType}". I have reviewed the symptoms you entered ("${symptoms}"). Let's start discussing right away!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setDirectMessages((prev) => [...prev, botanistGreeting]);
    onChallengeProgress("diagnosing", 1);

    // Reset fields
    setPlantType("");
    setSymptoms("");
    setSelectedBotanist(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeAppointmentId || !activeAppointment) return;

    const userMessageText = chatInput.trim();
    const newUserMsg: DirectMessage = {
      id: `msg-usr-${Date.now()}`,
      appointmentId: activeAppointmentId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setDirectMessages((prev) => [...prev, newUserMsg]);
    setChatInput("");

    // Simulate replies from Botanist if the customer sent a message and we are NOT logged in as a botanist
    if (currentUser.role === "customer") {
      const botanistReplyId = activeAppointment.botanistId;
      const botanistName = activeAppointment.botanistName;

      setTimeout(() => {
        const organicReplies = [
          `That is very interesting. I recommend you immediately inspect the potting soil. Gently poke standard potting dirt to check if it smells musty.`,
          `We should also consider dynamic humidity. Try placing a shallow pebble-water tray beside your ${activeAppointment.plantType} to ease immediate foliage stress.`,
          `I am calculating the compound nutrient requirements. Try spreading a cup of cold brewed green tea around the soil tomorrow. Let me know if that works!`,
          `Excellent question. To avoid scale insect pests, please spray diluted organic neem oil on the lower margins of the leaves during sunset.`
        ];
        const pickedReply = organicReplies[Math.floor(Math.random() * organicReplies.length)];
        
        const botReply: DirectMessage = {
          id: `msg-bot-reply-${Date.now()}`,
          appointmentId: activeAppointmentId,
          senderId: botanistReplyId,
          senderName: botanistName,
          text: `[SIMULATED EXPERT REPLY] ${pickedReply}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setDirectMessages((prev) => [...prev, botReply]);
      }, 1500);
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4">
      
      {/* Banner */}
      <div className="border-b border-forest-100 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-forest-900 tracking-tight">Tele-Botanist Consultation Desk</h2>
          <p className="text-xs sm:text-sm text-sage-700 mt-1">
            Book professional slots with expert human agronomists, review diagnostics, and check your direct botanical message center.
          </p>
        </div>
        <div className="bg-forest-900 text-cream-50 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-2">
          <span>Active view as:</span>
          <span className="text-gold-500 font-bold">{currentUser.role.toUpperCase()}</span>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 rounded-[24px] border-2 border-emerald-300 bg-emerald-500/10 p-5 flex items-start space-x-3 text-emerald-800 animate-fadeIn">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wide leading-relaxed">{successMsg}</div>
        </div>
      )}

      {errorText && (
        <div className="mb-6 rounded-[24px] border-2 border-rose-300 bg-rose-500/15 p-5 flex items-start space-x-3 text-rose-800 animate-fadeIn">
          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wide leading-relaxed">{errorText}</div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left pane (8 cols): Booking & active lists */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* CUSTOMER MODE: BOOK APPOINTMENT SLOTS */}
          {currentUser.role === "customer" && (
            <div className="rounded-[40px] border-2 border-forest-900/10 bg-cream-50 p-6 sm:p-8 shadow-xs">
              <h3 className="font-display font-black text-xs uppercase tracking-widest text-forest-900 mb-6 flex items-center gap-1.5 pb-2 border-b border-forest-100">
                <Sparkles className="h-4 w-4 text-gold-500" />
                <span>Book a live diagnostic session</span>
              </h3>

              {selectedBotanist ? (
                <form onSubmit={handleBook} className="space-y-4 animate-fadeIn">
                  <div className="flex items-center space-x-3 p-4 rounded-3xl bg-[#FAF9F5] border border-forest-900/5 mb-4">
                    <img
                      src={selectedBotanist.avatar}
                      alt={selectedBotanist.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-black uppercase text-sage-500 tracking-widest">selected expert</p>
                      <h4 className="font-bold text-sm text-forest-900 uppercase">{selectedBotanist.name}</h4>
                      <p className="text-[11px] text-[#1B3022] font-semibold">Specialty: {selectedBotanist.specialization}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedBotanist(null)}
                      className="ml-auto text-xs font-black text-rose-600 hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                        Select Date
                      </label>
                      <input
                        type="date"
                        required
                        min="2026-05-20"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-900 rounded-2xl p-2.5 text-xs font-medium focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                        Select Time Slot
                      </label>
                      <select
                        value={bookingSlot}
                        onChange={(e) => setBookingSlot(e.target.value)}
                        className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-900 rounded-2xl p-2.5 text-xs font-medium focus:outline-hidden"
                      >
                        <option>09:00 AM - 10:00 AM</option>
                        <option>11:00 AM - 12:00 PM</option>
                        <option>02:00 PM - 03:00 PM</option>
                        <option>04:00 PM - 05:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                      Plant Cohort Type
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fiddle-Leaf Fig / Climbing Bougainvillea"
                      value={plantType}
                      onChange={(e) => setPlantType(e.target.value)}
                      className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-800 rounded-2xl p-2.5 text-xs font-medium focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                      Describe Plant Symptoms
                    </label>
                    <textarea
                      required
                      placeholder="e.g. Lower leaves turning mushy yellow, white spider webs on margins..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-800 rounded-2xl p-3 text-xs font-medium focus:outline-hidden h-24 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 cursor-pointer bg-gold-400 hover:bg-gold-500 text-forest-950 font-black tracking-widest uppercase text-xs rounded-full shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>SECURE APPOINTMENT ({selectedBotanist.consultationFee} PTS)</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-forest-750 font-medium">Select a certified pathology expert and schedule a remote diagnostic call:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {botanists.map((bot) => (
                      <div
                        key={bot.id}
                        onClick={() => setSelectedBotanist(bot)}
                        className="p-4 rounded-[24px] border-2 border-forest-900/5 bg-[#FAF9F5] hover:border-gold-500 cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={bot.avatar}
                            alt={bot.name}
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 rounded-xl object-cover shrink-0 border border-forest-100"
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-xs text-forest-900 uppercase truncate">{bot.name}</h4>
                            <p className="text-[10px] text-sage-600 font-semibold truncate leading-none mt-1">{bot.specialization}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-forest-100/50 flex justify-between items-center text-[10px]">
                          <span className="flex items-center text-gold-600 font-bold">
                            <Star className="h-3 w-3 fill-current mr-0.5" />
                            {bot.rating || 4.7}
                          </span>
                          <span className="text-forest-900 font-extrabold font-mono uppercase bg-gold-500/10 text-gold-700 px-2 py-0.5 rounded-full">
                            {bot.consultationFee} PTS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE APPOINTMENTS LOGS */}
          <div className="rounded-[40px] border-2 border-forest-900/10 bg-cream-50 p-6 sm:p-8 shadow-xs">
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#1B3022]/60 mb-5 flex items-center gap-1.5 pb-2 border-b border-forest-100">
              <Clock className="h-4 w-4 text-sage-500" />
              <span>Consultations Schedule Ledger</span>
            </h3>

            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-10 w-10 text-sage-300 mx-auto mb-2" />
                <p className="text-xs text-forest-700 font-bold">No appointments scheduled on this account.</p>
                {currentUser.role === "customer" && (
                  <p className="text-[10px] text-sage-500 mt-1">Select an expert botanist above to open an active ticket!</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((app) => {
                  const isActive = activeAppointmentId === app.id;
                  
                  return (
                    <div
                      key={app.id}
                      onClick={() => setActiveAppointmentId(app.id)}
                      className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${
                        isActive
                          ? "bg-forest-900 text-cream-50 border-forest-900"
                          : "bg-[#FAF9F5] text-forest-900 border-forest-900/5 hover:border-sage-400"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-xs uppercase">
                              {currentUser.role === "customer" ? `DR. ${app.botanistName}` : `CLEINT: ${app.customerName}`}
                            </h4>
                            <span className="text-[9px] uppercase font-black bg-gold-500 text-forest-950 font-mono px-1.5 py-0.2 rounded-full">
                              {app.plantType}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-sage-400 font-mono">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {app.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {app.timeSlot}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:self-center">
                          <span className="text-[11px] font-bold capitalize px-3 py-1 bg-white/10 rounded-full border border-white/20">
                            {app.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveAppointmentId(isActive ? null : app.id);
                            }}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                              isActive
                                ? "bg-white text-forest-950 border-white hover:bg-sage-100"
                                : "bg-forest-900 text-cream-50 border-forest-900 hover:bg-forest-950"
                            }`}
                          >
                            {isActive ? "Closing" : "Open Chat Message Desk 💬"}
                          </button>
                        </div>
                      </div>

                      {/* Expand symptoms details inside item */}
                      <div className="mt-3 pt-3 border-t border-forest-900/5 text-[11px] text-forest-800 leading-relaxed bg-[#F3F2EC] p-3 rounded-2xl text-forest-950">
                        <span className="font-bold uppercase tracking-wider block text-[10px] text-sage-600 font-mono mb-1">Diagnosed Symptoms:</span>
                        "{app.symptoms}"
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right pane (5 cols): Secure Chat Console */}
        <div className="lg:col-span-5 h-[560px] flex flex-col rounded-[32px] border-2 border-forest-900/10 bg-cream-50 shadow-xs overflow-hidden">
          {activeAppointment ? (
            <>
              {/* Chat Header */}
              <div className="bg-forest-850 px-5 py-4 border-b border-forest-900 flex items-center justify-between text-cream-50">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gold-500" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider leading-none">
                      {currentUser.role === "customer" ? `${activeAppointment.botanistName} Chat Room` : `Patient Client: ${activeAppointment.customerName}`}
                    </h4>
                    <span className="text-[9px] text-sage-300 font-mono">Order Ticket: {activeAppointment.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveAppointmentId(null)}
                  className="text-xs text-sage-400 hover:text-white"
                >
                  Disconnect
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F5] scrollbar-thin">
                <div className="text-center">
                  <span className="text-[9px] uppercase font-black text-sage-600 bg-sage-500/5 px-2.5 py-1 rounded-md tracking-widest inline-block mb-3 border border-forest-900/5">
                    End-to-End Canopy Consulting Link
                  </span>
                </div>

                {activeChatMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-sage-400 font-black uppercase mb-0.5">
                        {isMe ? "YOU" : msg.senderName}
                      </span>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                          isMe
                            ? "bg-forest-900 text-cream-50 rounded-tr-none"
                            : "bg-[#E6ECEA] text-forest-950 border border-forest-900/5 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[8px] font-mono text-sage-500 mt-0.5">{msg.timestamp}</span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-forest-100 bg-cream-50 flex items-center space-x-2">
                <input
                  type="text"
                  required
                  placeholder={`Type response to ${currentUser.role === 'customer' ? 'Botanist' : 'Customer'}...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-white border-2 border-forest-900/5 hover:border-forest-900/10 focus:border-forest-900 rounded-full px-4 py-2 text-xs focus:outline-hidden text-forest-950"
                />
                <button
                  type="submit"
                  className="h-9 w-9 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center hover:bg-forest-950 cursor-pointer active:scale-95 transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#FAF9F5]">
              <MessageSquare className="h-12 w-12 text-sage-300/80 mb-3 animate-pulse" />
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-forest-900">Consultation Live Chat</h4>
              <p className="text-[11px] text-forest-750 max-w-xs mt-1.5 leading-relaxed">
                Click **"Open Chat Message Desk"** next to any active appointment to consult and analyze yellow leaves, insects pest remedies, or custom composting!
              </p>
              <div className="mt-4 p-3 bg-cream-50 rounded-2xl border border-forest-900/5 text-[10px] text-sage-600 font-mono">
                💡 Log in as different members to simulate both patient and botanist sides!
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
