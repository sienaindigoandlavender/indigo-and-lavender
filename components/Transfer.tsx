"use client";
const HOUSE = "Derb Fhal Zefriti";

// The guest asks for an airport or station transfer (Jacqueline, 21 Oct 2026).
// Personal link: /transfer?b=<booking>&k=<signature> (same signature as /arrival and /welcome),
// or the open form (name + booking number typed in, no lookup needed). The request lands on the ops transfer board as
// "à confirmer", and Zahra, Charif and the guest get a WhatsApp at once (lib/transferRequest.ts).

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DatePicker, { todayYMD } from "@/components/DatePicker";

type Stay = { firstName: string; room: string; checkIn: string; checkOut: string; phone: string; language: string; people: number };
type L = "en" | "fr" | "it" | "es" | "pt";
const LS: L[] = ["en", "fr", "it", "es", "pt"];
const langFrom = (x: string): L => (/fr/i.test(x) ? "fr" : /ital|^it/i.test(x) ? "it" : /span|^es/i.test(x) ? "es" : /portug|^pt/i.test(x) ? "pt" : "en");

const WHATSAPP = "https://wa.me/212619112008";
const SLOTS = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);

const T = {
  en: {
    title: "Your transfer", hello: "Hello {name},",
    intro: "A private driver between the riad and the airport, the train station or the bus station. 200 MAD per car from the airport. Fill this in and Charif, the driver, confirms it with you on WhatsApp.",
    direction: "Which way?", arrival: "To the riad (arriving)", departure: "From the riad (leaving)", elsewhere: "Somewhere else", other: "Another trip (e.g. to a villa)", otherFrom: "From", otherTo: "To", otherToHint: "The address or the name of the place",
    place: "Where?", airport: "Marrakech Menara Airport", station: "Marrakech train station",
    date: "Date", time: "Time", timeArr: "When your plane or train lands", timeDep: "When the driver should collect you",
    flight: "Flight or train number", people: "Number of people", bags: "Number of suitcases",
    phone: "Your WhatsApp number", phoneHint: "With the country code, e.g. +44 7700 900123",
    notes: "Anything we should know", optional: "(optional)", choose: "Choose",
    send: "Request my transfer", sending: "Sending…",
    done: "Thank you. Your request is with Zahra, and we have sent you a WhatsApp with the details and where to find your driver. Zahra will confirm it with you.", doneOther: "Thank you. Your request is with Charif, the driver, and we have sent you a WhatsApp with the details. Charif will confirm it with you.",
    first: "First name", last: "Last name", number: "Booking number", numberHint: "From Booking.com, Airbnb or our website",
    notFound: "We couldn't find that booking. Please message Zahra on WhatsApp.", questions: "Questions? Zahra on WhatsApp:",
  },
  fr: {
    title: "Votre transfert", hello: "Bonjour {name},",
    intro: "Un chauffeur privé entre le riad et l'aéroport, la gare ou la gare routière. 200 MAD par voiture depuis l'aéroport. Remplissez ce formulaire et Charif, le chauffeur, vous le confirme sur WhatsApp.",
    direction: "Dans quel sens ?", arrival: "Vers le riad (arrivée)", departure: "Depuis le riad (départ)", elsewhere: "Ailleurs", other: "Un autre trajet (par ex. vers une villa)", otherFrom: "Départ", otherTo: "Destination", otherToHint: "L'adresse ou le nom du lieu",
    place: "Où ?", airport: "Aéroport Marrakech Menara", station: "Gare de Marrakech",
    date: "Date", time: "Heure", timeArr: "L'heure d'atterrissage ou d'arrivée du train", timeDep: "L'heure à laquelle le chauffeur vient vous chercher",
    flight: "Numéro de vol ou de train", people: "Nombre de personnes", bags: "Nombre de valises",
    phone: "Votre numéro WhatsApp", phoneHint: "Avec l'indicatif du pays, ex. +33 6 12 34 56 78",
    notes: "Autre chose à nous dire", optional: "(facultatif)", choose: "Choisir",
    send: "Demander mon transfert", sending: "Envoi…",
    done: "Merci. Votre demande est entre les mains de Zahra, et nous vous avons envoyé un WhatsApp avec les détails et l'endroit où retrouver votre chauffeur. Zahra vous la confirmera.", doneOther: "Merci. Votre demande est entre les mains de Charif, le chauffeur, et nous vous avons envoyé un WhatsApp avec les détails. Charif vous la confirmera.",
    first: "Prénom", last: "Nom", number: "Numéro de réservation", numberHint: "Booking.com, Airbnb ou notre site",
    notFound: "Nous n'avons pas trouvé cette réservation. Écrivez à Zahra sur WhatsApp.", questions: "Une question ? Zahra sur WhatsApp :",
  },
  it: {
    title: "Il suo transfer", hello: "Buongiorno {name},",
    intro: "Un autista privato tra il riad e l'aeroporto, la stazione o la stazione degli autobus. 200 MAD per auto dall'aeroporto. Compili il modulo e Charif, l'autista, glielo conferma su WhatsApp.",
    direction: "In che direzione?", arrival: "Verso il riad (arrivo)", departure: "Dal riad (partenza)", elsewhere: "Altrove", other: "Un altro tragitto (es. verso una villa)", otherFrom: "Partenza", otherTo: "Destinazione", otherToHint: "L'indirizzo o il nome del luogo",
    place: "Dove?", airport: "Aeroporto Marrakech Menara", station: "Stazione di Marrakech",
    date: "Data", time: "Ora", timeArr: "L'ora di atterraggio o di arrivo del treno", timeDep: "L'ora in cui l'autista la viene a prendere",
    flight: "Numero di volo o di treno", people: "Numero di persone", bags: "Numero di valigie",
    phone: "Il suo numero WhatsApp", phoneHint: "Con il prefisso del paese, es. +39 333 123 4567",
    notes: "Altro da dirci", optional: "(facoltativo)", choose: "Scegliere",
    send: "Richiedere il transfer", sending: "Invio…",
    done: "Grazie. La sua richiesta è nelle mani di Zahra e le abbiamo inviato un WhatsApp con i dettagli e dove trovare l'autista. Zahra gliela confermerà.", doneOther: "Grazie. La sua richiesta è nelle mani di Charif, l'autista, e le abbiamo inviato un WhatsApp con i dettagli. Charif gliela confermerà.",
    first: "Nome", last: "Cognome", number: "Numero di prenotazione", numberHint: "Booking.com, Airbnb o il nostro sito",
    notFound: "Non abbiamo trovato questa prenotazione. Scriva a Zahra su WhatsApp.", questions: "Domande? Zahra su WhatsApp:",
  },
  es: {
    title: "Su traslado", hello: "Buenos días {name}:",
    intro: "Un conductor privado entre el riad y el aeropuerto, la estación de tren o la de autobuses. 200 MAD por coche desde el aeropuerto. Rellene el formulario y Charif, el conductor, se lo confirma por WhatsApp.",
    direction: "¿En qué sentido?", arrival: "Hacia el riad (llegada)", departure: "Desde el riad (salida)", elsewhere: "Otro lugar", other: "Otro trayecto (p. ej. a una villa)", otherFrom: "Salida", otherTo: "Destino", otherToHint: "La dirección o el nombre del lugar",
    place: "¿Dónde?", airport: "Aeropuerto Marrakech Menara", station: "Estación de tren de Marrakech",
    date: "Fecha", time: "Hora", timeArr: "La hora de aterrizaje o de llegada del tren", timeDep: "La hora a la que el conductor le recoge",
    flight: "Número de vuelo o de tren", people: "Número de personas", bags: "Número de maletas",
    phone: "Su número de WhatsApp", phoneHint: "Con el prefijo del país, p. ej. +34 612 345 678",
    notes: "Algo más que debamos saber", optional: "(opcional)", choose: "Elegir",
    send: "Solicitar mi traslado", sending: "Enviando…",
    done: "Gracias. Su solicitud está en manos de Zahra y le hemos enviado un WhatsApp con los detalles y dónde encontrar a su conductor. Zahra se la confirmará.", doneOther: "Gracias. Su solicitud está en manos de Charif, el conductor, y le hemos enviado un WhatsApp con los detalles. Charif se la confirmará.",
    first: "Nombre", last: "Apellido", number: "Número de reserva", numberHint: "Booking.com, Airbnb o nuestra web",
    notFound: "No hemos encontrado esta reserva. Escriba a Zahra por WhatsApp.", questions: "¿Preguntas? Zahra por WhatsApp:",
  },
  pt: {
    title: "O seu transfer", hello: "Bom dia, {name}.",
    intro: "Um motorista privado entre o riad e o aeroporto, a estação de comboios ou o terminal rodoviário. 200 MAD por carro desde o aeroporto. Preencha o formulário e o Charif, o motorista, confirma-lho no WhatsApp.",
    direction: "Em que sentido?", arrival: "Para o riad (chegada)", departure: "Do riad (partida)", elsewhere: "Outro lugar", other: "Outro trajeto (p. ex. para uma vila)", otherFrom: "Partida", otherTo: "Destino", otherToHint: "A morada ou o nome do lugar",
    place: "Onde?", airport: "Aeroporto Marrakech Menara", station: "Estação de comboios de Marraquexe",
    date: "Data", time: "Hora", timeArr: "A hora de aterragem ou de chegada do comboio", timeDep: "A hora a que o motorista o vem buscar",
    flight: "Número do voo ou do comboio", people: "Número de pessoas", bags: "Número de malas",
    phone: "O seu número de WhatsApp", phoneHint: "Com o indicativo do país, ex. +351 912 345 678",
    notes: "Mais alguma coisa que devamos saber", optional: "(opcional)", choose: "Escolher",
    send: "Pedir o meu transfer", sending: "A enviar…",
    done: "Obrigada. O seu pedido está nas mãos da Zahra e enviámos-lhe um WhatsApp com os detalhes e onde encontrar o motorista. A Zahra vai confirmá-lo.", doneOther: "Obrigada. O seu pedido está com o Charif, o motorista, e enviámos-lhe um WhatsApp com os detalhes. O Charif vai confirmá-lo.",
    first: "Nome", last: "Apelido", number: "Número da reserva", numberHint: "Booking.com, Airbnb ou o nosso site",
    notFound: "Não encontrámos esta reserva. Escreva à Zahra no WhatsApp.", questions: "Perguntas? A Zahra no WhatsApp:",
  },
};


// The quick, Uber-like flow (Jacqueline, 21 Oct 2026): one tap for the trip, the rest prefilled.
const U = {
  en: { whereTo: "Where are you going?", tArr: "Airport → riad", tArrSub: "When you arrive", tDep: "Riad → airport", tDepSub: "When you leave", tElse: "Riad → somewhere else", tElseSub: "When you leave, to another place", tStay: "A trip during your stay", tStaySub: "For example to a villa or a restaurant", station: "Train station instead", airportBack: "Airport instead", pickup: "Pick-up", dropoff: "Drop-off", when: "When?", who: "Who's coming?", minus: "One less", plus: "One more", note: "Add a note for the driver", wa: "We'll write to you on WhatsApp", change: "Change", go: "Request my driver", sum: "Your trip", flightQ: "Flight or train number (if you have it)", yours: "Your transfer requests", changeIt: "Change", cancelIt: "Cancel", cancelQ: "Cancel this transfer?", yesCancel: "Yes, cancel it", keep: "Keep it", cancelledMsg: "Your transfer is cancelled. The driver and the house have been told.", changedMsg: "Thank you. Your transfer is updated, and the driver and the house have been told.", manage: "To change or cancel it later, keep this link:", another: "Request another transfer", saveChanges: "Save the changes", chipAirport: "Airport", chipTrain: "Train station", chipBus: "Bus station", busName: "Marrakech bus station" },
  fr: { whereTo: "Où allez-vous ?", tArr: "Aéroport → riad", tArrSub: "À votre arrivée", tDep: "Riad → aéroport", tDepSub: "À votre départ", tElse: "Riad → ailleurs", tElseSub: "À votre départ, vers un autre lieu", tStay: "Un trajet pendant votre séjour", tStaySub: "Par exemple vers une villa ou un restaurant", station: "Plutôt la gare", airportBack: "Plutôt l'aéroport", pickup: "Prise en charge", dropoff: "Destination", when: "Quand ?", who: "Qui vient ?", minus: "Un de moins", plus: "Un de plus", note: "Ajouter un mot pour le chauffeur", wa: "Nous vous écrirons sur WhatsApp", change: "Modifier", go: "Demander mon chauffeur", sum: "Votre trajet", flightQ: "Numéro de vol ou de train (si vous l'avez)", yours: "Vos demandes de transfert", changeIt: "Modifier", cancelIt: "Annuler", cancelQ: "Annuler ce transfert ?", yesCancel: "Oui, l'annuler", keep: "Le garder", cancelledMsg: "Votre transfert est annulé. Le chauffeur et la maison sont prévenus.", changedMsg: "Merci. Votre transfert est modifié, et le chauffeur et la maison sont prévenus.", manage: "Pour le modifier ou l'annuler plus tard, gardez ce lien :", another: "Demander un autre transfert", saveChanges: "Enregistrer les modifications", chipAirport: "Aéroport", chipTrain: "Gare", chipBus: "Gare routière", busName: "Gare routière de Marrakech" },
  it: { whereTo: "Dove va?", tArr: "Aeroporto → riad", tArrSub: "Al suo arrivo", tDep: "Riad → aeroporto", tDepSub: "Alla partenza", tElse: "Riad → altrove", tElseSub: "Alla partenza, verso un altro luogo", tStay: "Un tragitto durante il soggiorno", tStaySub: "Per esempio verso una villa o un ristorante", station: "Invece la stazione", airportBack: "Invece l'aeroporto", pickup: "Partenza", dropoff: "Destinazione", when: "Quando?", who: "Chi viene?", minus: "Uno in meno", plus: "Uno in più", note: "Aggiungi una nota per l'autista", wa: "Le scriveremo su WhatsApp", change: "Cambia", go: "Richiedi il mio autista", sum: "Il suo tragitto", flightQ: "Numero di volo o di treno (se lo ha)", yours: "Le sue richieste di transfer", changeIt: "Modifica", cancelIt: "Annulla", cancelQ: "Annullare questo transfer?", yesCancel: "Sì, annullalo", keep: "Lo tengo", cancelledMsg: "Il suo transfer è annullato. L'autista e la casa sono stati avvisati.", changedMsg: "Grazie. Il suo transfer è aggiornato, e l'autista e la casa sono stati avvisati.", manage: "Per modificarlo o annullarlo più tardi, conservi questo link:", another: "Richiedi un altro transfer", saveChanges: "Salva le modifiche", chipAirport: "Aeroporto", chipTrain: "Stazione", chipBus: "Autobus", busName: "Stazione degli autobus di Marrakech" },
  es: { whereTo: "¿Adónde va?", tArr: "Aeropuerto → riad", tArrSub: "A su llegada", tDep: "Riad → aeropuerto", tDepSub: "A su salida", tElse: "Riad → otro lugar", tElseSub: "A su salida, hacia otro sitio", tStay: "Un trayecto durante su estancia", tStaySub: "Por ejemplo a una villa o un restaurante", station: "Mejor la estación", airportBack: "Mejor el aeropuerto", pickup: "Recogida", dropoff: "Destino", when: "¿Cuándo?", who: "¿Quién viene?", minus: "Uno menos", plus: "Uno más", note: "Añadir una nota para el conductor", wa: "Le escribiremos por WhatsApp", change: "Cambiar", go: "Pedir mi conductor", sum: "Su trayecto", flightQ: "Número de vuelo o de tren (si lo tiene)", yours: "Sus solicitudes de traslado", changeIt: "Cambiar", cancelIt: "Cancelar", cancelQ: "¿Cancelar este traslado?", yesCancel: "Sí, cancelarlo", keep: "Mantenerlo", cancelledMsg: "Su traslado está cancelado. El conductor y la casa ya lo saben.", changedMsg: "Gracias. Su traslado está actualizado, y el conductor y la casa ya lo saben.", manage: "Para cambiarlo o cancelarlo más tarde, guarde este enlace:", another: "Pedir otro traslado", saveChanges: "Guardar los cambios", chipAirport: "Aeropuerto", chipTrain: "Tren", chipBus: "Autobús", busName: "Estación de autobuses de Marrakech" },
  pt: { whereTo: "Para onde vai?", tArr: "Aeroporto → riad", tArrSub: "À chegada", tDep: "Riad → aeroporto", tDepSub: "À partida", tElse: "Riad → outro lugar", tElseSub: "À partida, para outro sítio", tStay: "Um trajeto durante a estadia", tStaySub: "Por exemplo para uma vila ou um restaurante", station: "Antes a estação", airportBack: "Antes o aeroporto", pickup: "Recolha", dropoff: "Destino", when: "Quando?", who: "Quem vem?", minus: "Menos um", plus: "Mais um", note: "Acrescentar uma nota para o motorista", wa: "Vamos escrever-lhe no WhatsApp", change: "Alterar", go: "Pedir o meu motorista", sum: "O seu trajeto", flightQ: "Número do voo ou do comboio (se o tiver)", yours: "Os seus pedidos de transfer", changeIt: "Alterar", cancelIt: "Cancelar", cancelQ: "Cancelar este transfer?", yesCancel: "Sim, cancelar", keep: "Manter", cancelledMsg: "O seu transfer está cancelado. O motorista e a casa já foram avisados.", changedMsg: "Obrigada. O seu transfer está atualizado, e o motorista e a casa já foram avisados.", manage: "Para o alterar ou cancelar mais tarde, guarde este link:", another: "Pedir outro transfer", saveChanges: "Guardar as alterações", chipAirport: "Aeroporto", chipTrain: "Comboio", chipBus: "Autocarro", busName: "Terminal rodoviário de Marraquexe" },
};
type Trip = "arr" | "dep" | "else" | "stay";

// The house form style (every project): a single underline, no box.
const input = "w-full border-0 border-b border-ink/30 bg-transparent px-0 py-3 text-[18px] placeholder:text-[15px] placeholder:italic placeholder:text-ink text-ink focus:outline-none focus:border-ink";
const dateField = `${input} text-left`;
const button = "w-full bg-door text-ink py-4 text-[17px] hover:bg-[#F1E2AE] transition-colors disabled:bg-tadelakt";
const label = "block house text-[22px] leading-tight mb-3";

function TransferForm() {
  const params = useSearchParams();
  const b = params.get("b") || "";
  const k = params.get("k") || "";
  const personal = !!(b && k);
  const [l, setL] = useState<L>(LS.includes(params.get("lang") as L) ? (params.get("lang") as L) : "en");
  const t = T[l];

  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(personal);
  const [number, setNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [direction, setDirection] = useState<"arrival" | "departure" | "other">("arrival");
  const [place, setPlace] = useState<"airport" | "station" | "bus" | "elsewhere">("airport");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [flight, setFlight] = useState("");
  const [otherFrom, setOtherFrom] = useState(HOUSE);
  const [otherTo, setOtherTo] = useState("");
  const [people, setPeople] = useState(2);
  const [bags, setBags] = useState(2);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [trip, setTrip] = useState<Trip>("arr");
  const [editPhone, setEditPhone] = useState(false);
  const [showNote, setShowNote] = useState(false);
  // Change or cancel (Jacqueline, 21 Oct 2026): the guest's own requests, from the personal link or a manage link.
  type Mine = { id: string; sig: string; direction: "arrival" | "departure" | "other"; date: string; time: string; from: string; to: string; flight: string; people: number; bags: number; phone: string; notes: string };
  const tParam = params.get("t") || "", sParam = params.get("s") || "";
  const manageMode = !!(tParam && sParam);
  const [mine, setMine] = useState<Mine[]>([]);
  const [editing, setEditing] = useState<{ id: string; sig: string } | null>(null);
  const [askCancel, setAskCancel] = useState("");
  const [outcome, setOutcome] = useState<"" | "changed" | "cancelled">("");
  const [manageLink, setManageLink] = useState("");
  const [showForm, setShowForm] = useState(!manageMode);
  const u = U[l];
  const knownPhone = !!(stay?.phone && stay.phone.replace(/\D/g, "").length >= 7);
  const pickTrip = (v: Trip) => {
    setTrip(v);
    setDirection(v === "arr" ? "arrival" : v === "stay" ? "other" : "departure");
    setPlace(v === "else" ? "elsewhere" : (p) => (p === "station" || p === "bus" ? p : "airport"));
    if (v === "stay") setOtherFrom(HOUSE);
  };
  const niceDate = (ymd: string) => (ymd ? new Date(`${ymd}T12:00:00Z`).toLocaleDateString(l === "pt" ? "pt-PT" : l, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }) : "");
  const hubName = place === "station" ? t.station : place === "bus" ? u.busName : t.airport;
  const fromTxt = trip === "arr" ? hubName : trip === "stay" ? otherFrom : HOUSE;
  const toTxt = trip === "arr" ? HOUSE : trip === "dep" ? hubName : otherTo || "…";
  const summary = [niceDate(date), time, `${fromTxt} → ${toTxt}`, `${people} · ${bags}`].filter(Boolean).join(" · ");

  const fillFrom = (s: Stay) => {
    setStay(s);
    setDate(s.checkIn);
    setPhone(s.phone || "");
    setPeople(s.people || 2);
    if (!params.get("lang") && s.language) setL(langFrom(s.language));
  };

  useEffect(() => {
    if (manageMode) {
      fetch(`/api/transfer?t=${encodeURIComponent(tParam)}&s=${encodeURIComponent(sParam)}`)
        .then((r) => r.json())
        .then((d) => (d.transfer ? setMine([d.transfer]) : setError(d.error || "")))
        .finally(() => setLoading(false));
      return;
    }
    if (!personal) return;
    fetch(`/api/transfer?b=${encodeURIComponent(b)}&k=${encodeURIComponent(k)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.booking) { fillFrom(d.booking); if (Array.isArray(d.transfers) && d.transfers.length) { setMine(d.transfers); setShowForm(false); } }
        else setError(d.error || "");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stay && !editing) setDate(direction === "arrival" ? stay.checkIn : stay.checkOut || stay.checkIn);
    if (direction !== "departure") setPlace((p) => (p === "elsewhere" ? "airport" : p));
  }, [direction, stay]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const who = editing ? { t: editing.id, s: editing.sig, lang: l } : personal ? { b, k, lang: l } : { number, firstName, lastName, lang: l };
    const r = await fetch("/api/transfer", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...who, direction, place, otherFrom, otherTo, date, time, flight, people, bags, phone, notes }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (d.ok) { if (editing) setOutcome("changed"); if (d.manage) setManageLink(d.manage); setDone(true); }
    else setError(d.error || t.notFound);
  }

  function startEdit(m: Mine) {
    const bus = /bus station/i.test(`${m.from} ${m.to}`);
    const station = !bus && /train station/i.test(`${m.from} ${m.to}`);
    const v: Trip = m.direction === "arrival" ? "arr" : m.direction === "other" ? "stay" : /airport|station|menara/i.test(m.to) ? "dep" : "else";
    setEditing({ id: m.id, sig: m.sig });
    setTrip(v);
    setDirection(m.direction);
    setPlace(v === "else" ? "elsewhere" : bus ? "bus" : station ? "station" : "airport");
    if (v === "stay") { setOtherFrom(m.from); setOtherTo(m.to); }
    if (v === "else") setOtherTo(m.to);
    setDate(m.date); setTime(m.time); setFlight(m.flight || ""); setPeople(m.people || 1); setBags(m.bags || 0);
    if (m.phone) setPhone(m.phone);
    setNotes(m.notes || ""); setShowNote(!!m.notes);
    setShowForm(true);
  }

  async function cancelOne(m: Mine) {
    setBusy(true); setError("");
    const r = await fetch("/api/transfer", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ t: m.id, s: m.sig }) });
    const d = await r.json().catch(() => ({}));
    setBusy(false); setAskCancel("");
    if (d.ok) { setMine((xs) => xs.filter((x) => x.id !== m.id)); setOutcome("cancelled"); setDone(true); }
    else setError(d.error || t.notFound);
  }

  return (
    <div className="min-h-screen bg-limewash text-ink">
      <section className="pt-28 pb-24 md:pt-36">
        <div className="mx-auto px-6 max-w-xl">
          <div className="flex items-baseline gap-3 text-[15px] mb-8">
            <span>Jacqueline, Zahra &amp; Mouad</span>
            <span className="ms-auto flex gap-3">
              {LS.map((x) => (
                <button key={x} type="button" onClick={() => setL(x)} aria-pressed={x === l} className={x === l ? "underline underline-offset-4 decoration-bejmat decoration-2" : "hover:underline underline-offset-4"}>{x.toUpperCase()}</button>
              ))}
            </span>
          </div>

          {/* The ink-and-wash drawing of the moment (public/drawings): a happy private-transfer van before the Koutoubia. */}
          <img src="/drawings/transfer-car.svg" alt="" aria-hidden draggable={false} className="block w-full max-w-[460px] -ms-2 mb-6 select-none" />

          <h1 className="house font-light text-[clamp(2.5rem,9vw,3.8rem)] leading-[1.02] tracking-[-0.03em] mb-6">
            {stay?.firstName ? t.hello.replace("{name}", stay.firstName) : t.title}
          </h1>
          <p className="text-[18px] leading-[1.7] mb-10">{t.intro}</p>

          {loading ? null : done ? (
            <div className="bg-tadelakt px-6 py-8 md:px-8 text-[18px] leading-[1.7] space-y-4">
              <p>{outcome === "cancelled" ? u.cancelledMsg : outcome === "changed" ? u.changedMsg : t.doneOther}</p>
              {manageLink && <p className="text-[16px]">{u.manage} <a className="underline underline-offset-4 break-all" href={manageLink}>{manageLink}</a></p>}
            </div>
          ) : (mine.length > 0 && !showForm) ? (
            <div className="space-y-4">
              <h2 className="house text-[22px]">{u.yours}</h2>
              {mine.map((m) => (
                <div key={m.id} className="bg-white px-5 py-4">
                  <p className="text-[18px]">{niceDate(m.date)} · {m.time}</p>
                  <p className="text-[16px] mt-1">{m.from} → {m.to} · {m.people} · {m.bags}{m.flight ? ` · ${m.flight}` : ""}</p>
                  {askCancel === m.id ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-[16px]">{u.cancelQ}</span>
                      <button type="button" disabled={busy} onClick={() => cancelOne(m)} className="px-4 py-2 bg-bejmat text-white text-[16px]">{u.yesCancel}</button>
                      <button type="button" onClick={() => setAskCancel("")} className="px-4 py-2 border border-ink/40 text-[16px]">{u.keep}</button>
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-3">
                      <button type="button" onClick={() => startEdit(m)} className="px-4 py-2 border border-ink text-[16px]">{u.changeIt}</button>
                      <button type="button" onClick={() => setAskCancel(m.id)} className="px-4 py-2 border border-ink/40 text-[16px]">{u.cancelIt}</button>
                    </div>
                  )}
                </div>
              ))}
              {error && <p className="text-[#8a3b2b] text-[17px]">{error}</p>}
              {!manageMode && <button type="button" onClick={() => setShowForm(true)} className="text-[16px] underline underline-offset-4">+ {u.another}</button>}
            </div>
          ) : manageMode && !editing ? (
            error ? <p className="text-[#8a3b2b] text-[17px]">{error}</p> : null
          ) : stay || !personal || manageMode ? (
            <form onSubmit={send} className="space-y-9 pb-28">
              {!personal && !manageMode && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block"><span className={label}>{t.first}</span><input className={input} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required /></label>
                    <label className="block"><span className={label}>{t.last}</span><input className={input} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required /></label>
                  </div>
                  <label className="block"><span className={label}>{t.number}</span><input className={input} value={number} onChange={(e) => setNumber(e.target.value)} placeholder={t.numberHint} autoComplete="off" required /></label>
                </>
              )}

              {/* 1. One tap: the trip. */}
              <fieldset>
                <legend className={label}>{u.whereTo}</legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  {([["arr", u.tArr, u.tArrSub], ["dep", u.tDep, u.tDepSub], ["else", u.tElse, u.tElseSub], ["stay", u.tStay, u.tStaySub]] as [Trip, string, string][]).map(([v, title, sub]) => (
                    <button key={v} type="button" onClick={() => pickTrip(v)} aria-pressed={trip === v}
                      className={`text-left px-5 py-4 border transition-colors ${trip === v ? "bg-door border-ink" : "bg-white border-ink/20 hover:border-ink/50"}`}>
                      <span className="block text-[18px]">{title}</span>
                      <span className="block text-[15px] mt-0.5">{sub}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* 2. The route, like a ride app: pick-up and drop-off. */}
              <div className="bg-white px-5 py-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span aria-hidden className="mt-2 w-2.5 h-2.5 rounded-full bg-ink shrink-0" />
                  <div className="flex-1">
                    <span className="block text-[14px]">{u.pickup}</span>
                    {trip === "stay"
                      ? <input className={input} value={otherFrom} onChange={(e) => setOtherFrom(e.target.value)} required />
                      : <span className="block text-[18px] py-1">{trip === "arr" ? hubName : "Café Medina Rouge, by the Koutoubia"}</span>}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span aria-hidden className="mt-2 w-2.5 h-2.5 bg-bejmat shrink-0" />
                  <div className="flex-1">
                    <span className="block text-[14px]">{u.dropoff}</span>
                    {trip === "else" || trip === "stay"
                      ? <input className={input} value={otherTo} onChange={(e) => setOtherTo(e.target.value)} placeholder={t.otherToHint} required />
                      : <span className="block text-[18px] py-1">{trip === "arr" ? HOUSE : hubName}</span>}
                  </div>
                </div>
                {(trip === "arr" || trip === "dep") && (
                  <div className="flex flex-wrap gap-2 pt-1" role="group">
                    {([["airport", u.chipAirport], ["station", u.chipTrain], ["bus", u.chipBus]] as ["airport" | "station" | "bus", string][]).map(([v, lab]) => (
                      <button key={v} type="button" onClick={() => setPlace(v)} aria-pressed={place === v}
                        className={`px-3 py-1.5 text-[15px] border ${place === v ? "bg-ink text-limewash border-ink" : "border-ink/30"}`}>{lab}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. When. */}
              <div>
                <span className={label}>{u.when}</span>
                <div className="grid grid-cols-2 gap-4">
                  <div><DatePicker className={dateField} value={date} onChange={setDate} min={todayYMD()} required ariaLabel={t.date} placeholder="" /></div>
                  <select className={input} value={time} onChange={(e) => setTime(e.target.value)} required aria-label={t.time}><option value="">{t.time}</option>{SLOTS.map((x) => <option key={x}>{x}</option>)}</select>
                </div>
                <p className="mt-2 text-[15px]">{trip === "arr" ? t.timeArr : t.timeDep}</p>
              </div>
              {(trip === "arr" || trip === "dep") && (
                <label className="block"><span className="block text-[16px] mb-1">{u.flightQ}</span><input className={input} value={flight} onChange={(e) => setFlight(e.target.value)} placeholder="EZY8901" /></label>
              )}

              {/* 4. Who: steppers, no typing. */}
              <div>
                <span className={label}>{u.who}</span>
                <div className="grid grid-cols-2 gap-4">
                  {([[t.people, people, setPeople, 1, 20], [t.bags, bags, setBags, 0, 40]] as [string, number, (n: number) => void, number, number][]).map(([lab, n, set, min, max]) => (
                    <div key={lab} className="bg-white px-4 py-3">
                      <span className="block text-[14px]">{lab}</span>
                      <div className="flex items-center justify-between mt-1">
                        <button type="button" aria-label={u.minus} onClick={() => set(Math.max(min, n - 1))} className="w-10 h-10 border border-ink/30 text-[22px] leading-none">−</button>
                        <span className="house text-[26px] tabular-nums">{n}</span>
                        <button type="button" aria-label={u.plus} onClick={() => set(Math.min(max, n + 1))} className="w-10 h-10 border border-ink/30 text-[22px] leading-none">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. WhatsApp: shown, not asked, when we already have it. */}
              {knownPhone && !editPhone ? (
                <p className="text-[17px]">{u.wa}: <b>{phone}</b> <button type="button" onClick={() => setEditPhone(true)} className="ms-2 underline underline-offset-4 text-[15px]">{u.change}</button></p>
              ) : (
                <label className="block"><span className={label}>{t.phone}</span><input className={input} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phoneHint} required /></label>
              )}

              {showNote ? (
                <label className="block"><span className="block text-[16px] mb-1">{t.notes}</span><textarea className={input} rows={2} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
              ) : (
                <button type="button" onClick={() => setShowNote(true)} className="text-[16px] underline underline-offset-4">+ {u.note}</button>
              )}

              {error && <p className="text-[#8a3b2b] text-[17px]">{error}</p>}

              {/* The request bar stays at the bottom of the screen, with the trip in one line. */}
              <div className="fixed inset-x-0 bottom-0 z-20 bg-limewash/95 backdrop-blur border-t border-ink/15">
                <div className="mx-auto max-w-xl px-6 py-3">
                  <p className="text-[15px] mb-2 truncate">{summary}</p>
                  <button className={button} disabled={busy}>{busy ? t.sending : editing ? u.saveChanges : u.go}</button>
                </div>
              </div>
            </form>
          ) : (
            <p className="text-[#8a3b2b] text-[18px]">{error || t.notFound}</p>
          )}

          <p className="mt-14 pt-8 border-t border-ink/15 text-[17px]">
            {t.questions} <a className="underline underline-offset-4 decoration-bejmat" href={WHATSAPP}>https://wa.me/212619112008</a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default function Transfer() {
  return (
    <Suspense>
      <TransferForm />
    </Suspense>
  );
}
