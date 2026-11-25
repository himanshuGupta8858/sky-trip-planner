"use client";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { ChatMessage, TripInfo } from "@/types/trip";
import axios from "axios";
import { useMutation } from "convex/react";
import { Loader2, Pencil, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Budget from "./Budget";
import Duration from "./Duration";
import EmptyBoxState from "./EmptyBoxstate";
import FinalUI from "./FinalUI";
import GroupSize from "./GroupSize";

export type { TripInfo };

const Chatbox = () => {
  const searchParams = useSearchParams();
  const hasAutoSent = useRef(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo>();
  const { userDetail } = useUserDetail();
  const saveTripDetail = useMutation(api.tripDetail.createTripDetail);
  const { setTripDetailInfo } = useTripDetail();

  const onSend = useCallback(
    async (input?: string, overrideIsFinal?: boolean) => {
      const msgContent = input !== undefined ? input : userInput;
      if (!msgContent?.trim()) return;

      const effectiveIsFinal = overrideIsFinal !== undefined ? overrideIsFinal : isFinal;
      const newMsg: ChatMessage = { role: "user", content: msgContent };

      setMessages((prev) => [...prev, newMsg]);
      setUserInput("");
      setLoading(true);
      try {
        const result = await axios.post<TripInfo & { resp?: string; ui?: string }>(
          "/api/aimodel",
          {
            messages: [...messages, newMsg],
            isFinal: effectiveIsFinal,
          }
        );

        if (!effectiveIsFinal) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: result?.data?.resp || "",
              ui: result?.data?.ui,
            },
          ]);
        }

        if (effectiveIsFinal && result?.data && userDetail?._id) {
          setTripDetail(result.data);
          setTripDetailInfo(result.data);
          const tripId = uuidv4();
          await saveTripDetail({
            tripDetail: result.data,
            tripId,
            uid: userDetail._id as Id<"UserTable">,
          });
        }
      } catch (err) {
        console.error("Error sending message:", err);
      } finally {
        setLoading(false);
      }
    },
    [isFinal, messages, saveTripDetail, setTripDetailInfo, userDetail?._id, userInput]
  );

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && !hasAutoSent.current) {
      hasAutoSent.current = true;
      void onSend(prompt);
    }
  }, [searchParams, onSend]);

  const renderGenUI = (ui: string | undefined) => {
    if (ui === "budget") {
      return <Budget onSelectOption={(v: string) => setUserInput(v)} />;
    }
    if (ui === "groupSize") {
      return <GroupSize onSelectOption={(v: string) => setUserInput(v)} />;
    }
    if (ui === "duration") {
      return <Duration onSelectOption={(v: string) => setUserInput(v)} />;
    }
    if (ui === "final") {
      return <FinalUI viewTripPlan={() => {}} disable={!tripDetail} />;
    }
    return null;
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "final" && !isFinal && !loading) {
      setIsFinal(true);
      void onSend("Ok, Great!", true);
    }
  }, [messages, isFinal, loading, onSend]);

  return (
    <div className="h-[70vh] md:h-[84vh] w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-xl md:shadow-2xl rounded-2xl md:rounded-lg p-2 md:p-3 flex flex-col">
      {messages.length === 0 && <EmptyBoxState onSelectOption={(v: string) => void onSend(v)} />}
      <section className="flex-1 overflow-y-auto p-4" aria-label="Trip planning conversation" aria-live="polite" aria-busy={loading}>
        <div className="flex flex-col gap-2">
          {messages.map((msg, index) =>
            msg.role === "user" ? (
              <div key={index} className="flex justify-end mt-2">
                <div className="max-w-xl py-2 px-4 rounded-lg bg-primary text-white">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-start mt-2">
                <div className="max-w-xl py-2 px-4 rounded-lg bg-gray-100 text-black">
                  {msg.content}
                  {renderGenUI(msg.ui)}
                </div>
              </div>
            )
          )}
          {loading && (
            <div className="flex justify-start mt-2" role="status">
              <div className="bg-gray-100 text-black py-2 px-4 rounded-lg flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" aria-hidden="true" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </section>
      <section aria-label="Message input">
        <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 shadow-sm hover:border-gray-300 transition-colors">
          <Pencil className="w-5 h-5 text-gray-400 mr-3" aria-hidden="true" />
          <label htmlFor="chatbox-trip-input" className="sr-only">
            Trip planning prompt
          </label>
          <input
            id="chatbox-trip-input"
            type="text"
            onChange={(e) => setUserInput(e.target.value ?? "")}
            value={userInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void onSend();
              }
            }}
            placeholder="Start typing your trip idea..."
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-lg"
          />
          <button
            type="button"
            disabled={loading}
            className="ml-3 w-12 h-12 rounded-full bg-primary hover:bg-[#FF5A3A] transition-colors flex items-center justify-center text-white shadow-md disabled:opacity-50 cursor-pointer"
            aria-label="Send trip message"
            onClick={() => void onSend()}
          >
            <Send className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Chatbox;
