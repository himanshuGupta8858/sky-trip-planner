"use client"
import { useTripDetail, useUserDetail } from '@/app/provider'
import { api } from '@/convex/_generated/api'
import axios from 'axios'
import { useMutation } from 'convex/react'
import { Loader2, Pencil, Send } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Budget from './Budget'
import Duration from './Duration'
import EmptyBoxState from './EmptyBoxstate'
import FinalUI from './FinalUI'
import GroupSize from './GroupSize'


type Message = {
    role: string;
    content: string;
    ui?: string;
}

export type TripInfo = {
    budget: string;
    destination: string;
    duration: string;
    group_size: string;
    origin: string;
    hotels: Hotel[];
    itinerary: Itinerary[];
}
type Hotel = {

    hotel_name: string;
    hotel_address: string;
    price_per_night: number;
    rating: number,
    hotel_image_url: string,
    description: string,
    geo_coordinates: {
        latitude: number,
        longitude: number,
    },
}
type Activity = {
    best_time_to_visit: string,
    geo_coordinates: {
                        latitude: number,
                        longitude: number,
                    },
    place_address: string,
    place_details:string,
    place_image_url:string,
    place_name: string,
    ticket_pricing: string,
    time_travel_each_location: string,
}
type Itinerary = {
    best_time_to_visit_day: string,
    day: number,
    day_plan: string,
    activities: Activity[];
}


const Chatbox = () => {
    const searchParams = useSearchParams();
    const hasAutoSent = useRef(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFinal, setIsFinal] = useState(false);
    const [tripDetail, setTripDetail] = useState<TripInfo>();
    const { userDetail, setUserDetail } = useUserDetail();
    const SaveTripDetail = useMutation(api.tripDetail.createTripDetail);
    const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

    const onSend = async (input?: string, overrideIsFinal?: boolean) => {
        const msgContent = input !== undefined ? input : userInput;
        if (!msgContent?.trim()) return;

        const effectiveIsFinal = overrideIsFinal !== undefined ? overrideIsFinal : isFinal;

        const newMsg: Message = { role: 'user', content: msgContent };
        setMessages((prev) => [...prev, newMsg]);
        setUserInput('');
        setLoading(true);
        try {
            const result = await axios.post('/api/aimodel', {
                messages: [...messages, newMsg],
                isFinal: effectiveIsFinal
            });
            !effectiveIsFinal && setMessages((prev: Message[]) => [...prev, {
                role: 'assistant',
                content: result?.data?.resp,
                ui: result?.data?.ui
            }]);
            if (effectiveIsFinal && result?.data && userDetail?._id) {
                setTripDetail(result?.data);
                setTripDetailInfo(result?.data);
                const tripId = uuidv4();
                await SaveTripDetail({
                    tripDetail: result?.data,
                    tripId: tripId,
                    uid: userDetail?._id,
                });
            }
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const prompt = searchParams.get('prompt');
        if (prompt && !hasAutoSent.current) {
            hasAutoSent.current = true;
            onSend(prompt);
        }
    }, [searchParams]);

    const RendergenUI = (ui: string | undefined) => {
        if (ui == "budget") {
            return <Budget onSelectOption={(v: string) => setUserInput(v)} />
        }
        else if (ui == "groupSize") {
            return <GroupSize onSelectOption={(v: string) => (setUserInput(v))} />
        }
        else if (ui == "duration") {
            return <Duration onSelectOption={(v: string) => (setUserInput(v))} />
        }
        else if (ui == 'final') {
            return <FinalUI viewTripPlan={() => {}} disable={!tripDetail} />
        }
        return null;
    }
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.ui === 'final' && !isFinal && !loading) {
            setIsFinal(true);
            onSend('Ok, Great!', true);
        }
    }, [messages, isFinal, loading]);
    return (
        <div className='h-[70vh] md:h-[84vh] w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-xl md:shadow-2xl rounded-2xl md:rounded-lg p-2 md:p-3 flex flex-col'>
            {messages?.length == 0 && <EmptyBoxState onSelectOption={(v: string) => onSend(v)} />}
            <section className='flex-1 overflow-y-auto p-4'>
                <div className="flex flex-col gap-2">
                    {messages.map((msg: Message, index) => (
                        msg.role === 'user' ?
                            <div key={index} className='flex justify-end mt-2'>
                                <div className='max-w-xl py-2 px-4 rounded-lg bg-primary text-white'>
                                    {msg.content}
                                </div>
                            </div> :
                            <div key={index} className='flex justify-start mt-2'>
                                <div className='max-w-xl py-2 px-4 rounded-lg bg-gray-100 text-black'>
                                    {msg.content}
                                    {RendergenUI(msg.ui ?? "")}
                                </div>
                            </div>
                    ))}
                    {loading && (
                        <div className='flex justify-start mt-2'>
                            <div className='bg-gray-100 text-black py-2 px-4 rounded-lg flex items-center gap-2'>
                                <Loader2 className='animate-spin w-5 h-5' />
                                <span className='text-sm'>Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <section>
                <div className='relative flex items-center bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 shadow-sm hover:border-gray-300 transition-colors'>
                    <Pencil className='w-5 h-5 text-gray-400 mr-3' />
                    <input
                        type='text'
                        onChange={(e) => setUserInput(e.target.value ?? "")}
                        value={userInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSend();
                            }
                        }}
                        placeholder='Start typing your trip idea...'
                        className='flex-1 outline-none text-gray-700 placeholder-gray-400 text-lg'
                    />
                    <button
                        disabled={loading}
                        className='ml-3 w-12 h-12 rounded-full bg-primary hover:bg-[#FF5A3A] transition-colors flex items-center justify-center text-white shadow-md disabled:opacity-50'
                        aria-label='Submit' onClick={() => onSend()}
                    >
                        <Send className='w-5 h-5' />
                    </button>
                </div>
            </section>
        </div>
    )
}

export default Chatbox