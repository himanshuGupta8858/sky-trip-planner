"use client"
import GlobalMap from '@/app/create-new-trip/_component/GlobalMap'
import Itinerary from '@/app/create-new-trip/_component/Itinerary'
import PackingList from '@/app/create-new-trip/_component/PackingList'
import TripPlannerAddon from '@/app/create-new-trip/_component/TripPlannerAddon'
import TripChatbot from '@/app/create-new-trip/_component/TripChatbot'
import PrintTravelGuide from '@/app/create-new-trip/_component/PrintTravelGuide'
import { useTripDetail, useUserDetail } from '@/app/provider'
import { api } from '@/convex/_generated/api'
import { useConvex, useMutation } from 'convex/react'
import { ArrowLeft, Check, CheckCircle, X, Star, Plane, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'

const ViewTrip = () => {
  const { tripId } = useParams();
  const { userDetail, setUserDetail } = useUserDetail();
  const convex = useConvex();
  const completeTrip = useMutation(api.tripDetail.completeTripDetail);
  const saveCompanion = useMutation(api.tripDetail.SaveCompanionData);

  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [addonData, setAddonData] = useState<any>(null);

  const googleFlightsUrl = useMemo(() => {
    if (!tripDetailInfo?.origin || !tripDetailInfo?.destination) return "";
    
    const cleanCity = (name: string) => {
      if (!name) return "";
      return name.split(",")[0].trim();
    };

    const originCity = cleanCity(tripDetailInfo.origin);
    const destCity = cleanCity(tripDetailInfo.destination);

    const date = new Date();
    date.setDate(date.getDate() + 7);
    const dateString = date.toISOString().split("T")[0];
    const query = `Flights to ${destCity} from ${originCity} on ${dateString}`;
    return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
  }, [tripDetailInfo?.origin, tripDetailInfo?.destination]);

  // Feedback Modal State
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [platformHelp, setPlatformHelp] = useState<string>('');
  const [usedPdfQr, setUsedPdfQr] = useState<string>('');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tripDetailRecord, setTripDetailRecord] = useState<any | null>(null);
  const [loadingAddon, setLoadingAddon] = useState(false);

  useEffect(() => {
    if (userDetail?._id) {
      GetTripDetail();
    }
  }, [userDetail?._id]);

  const fetchAddonData = async (origin: string, destination: string, currentTripId: string) => {
    try {
      setLoadingAddon(true);
      const res = await axios.post("/api/trip-addon", { origin, destination });
      if (res.data && !res.data.error) {
        setAddonData(res.data);
        // Save companion data to Convex to avoid future generation calls
        await saveCompanion({
          tripId: currentTripId,
          uid: userDetail._id,
          companionData: res.data
        });
      }
    } catch (err) {
      console.error("Error fetching addon data in page", err);
    } finally {
      setLoadingAddon(false);
    }
  };

  const GetTripDetail = async () => {
    const result = await convex.query(api?.tripDetail.GetTripById, {
      tripId: tripId + "",
      uid: userDetail._id
    });
    const tripDetail = result?.tripDetail;
    setTripDetailInfo(tripDetail);
    setTripDetailRecord(result);

    // If we already have stored companion details in the database, fetch them instantly
    if (result?.companionData) {
      setAddonData(result.companionData);
    } else if (tripDetail?.origin && tripDetail?.destination) {
      if (!addonData && !loadingAddon) {
        fetchAddonData(tripDetail.origin, tripDetail.destination, result.tripId || (tripId + ""));
      }
    }
  }

  const handleSubmitFeedback = async (isSkipped = false) => {
    if (!userDetail || !tripDetailRecord) return;
    setIsSubmitting(true);

    const feedbackData = isSkipped ? null : {
      rating,
      platformHelp,
      usedPdfQr,
      feedbackNotes
    };

    try {
      await completeTrip({
        tripId: tripId + "",
        uid: userDetail._id,
        feedback: feedbackData
      });
      setTripDetailRecord((prev: any) => ({
        ...prev,
        completed: true,
        feedback: feedbackData
      }));
      setShowCompleteModal(false);
      toast.success("Trip marked as completed! 🎉");
    } catch (err) {
      console.error("Failed to complete trip:", err);
      toast.error("Failed to mark trip as completed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="w-full md:col-span-3">
            <Itinerary trip={tripDetailInfo || undefined} activeDay={activeDay} setActiveDay={setActiveDay} />
          </div>
          <div className="w-full md:col-span-2">
            <div className="sticky top-20">
              <h1 className="px-2 text-4xl py-5">Interactive Trip Map</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div 
                  onClick={() => setActiveDay(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 w-fit cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200"
                  title="Reset to overview"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Overview</span>
                </div>
                
                {tripDetailRecord?.completed ? (
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30 font-bold text-xs shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450" />
                    <span>Trip Completed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCompleteModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs cursor-pointer transition-all duration-200 shadow-md shadow-emerald-500/10 hover:shadow-lg"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Trip Completed?</span>
                  </button>
                )}
              </div>

              {googleFlightsUrl && (
                <a 
                  href={googleFlightsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3.5 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-neutral-850 dark:to-neutral-800 border border-blue-100/60 dark:border-neutral-800 rounded-2xl cursor-pointer hover:shadow-sm hover:scale-[1.005] active:scale-[0.995] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/10 group-hover:animate-pulse">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">
                        Book Your Trip Flights
                      </h4>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                        Compare routes & schedule from {tripDetailInfo?.origin} to {tripDetailInfo?.destination}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-100/40 dark:bg-neutral-750 px-2.5 py-1 rounded-lg">
                    <span>Search</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              )}

              <GlobalMap trip={tripDetailInfo} activeDay={activeDay} />
              <div className="mt-6">
                <TripPlannerAddon trip={tripDetailInfo || undefined} initialData={addonData} />
              </div>
              <div className="mt-6">
                <PackingList trip={tripDetailInfo || undefined} />
              </div>
            </div>
          </div>
        </div>
        {tripDetailInfo && <TripChatbot tripContext={tripDetailInfo} />}
      </div>

      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowCompleteModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight">Trip Completed! 🎉</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">We hope you had a wonderful journey. Take a moment to rate your experience.</p>
              </div>

              {/* Rating Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider block">How was your trip?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= rating 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-neutral-300 dark:text-neutral-700'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Help */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider block">Did SkyTrip help you?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Yes', 'No', 'Somewhat'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPlatformHelp(option)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        platformHelp === option
                          ? 'bg-primary border-primary text-white'
                          : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* PDF QR Usage */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider block">Did you use the offline PDF / QR codes?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Yes', 'No'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setUsedPdfQr(option)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        usedPdfQr === option
                          ? 'bg-primary border-primary text-white'
                          : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider block">Comments or memories (optional)</label>
                <textarea
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Tell us about your highlights..."
                  className="w-full text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 outline-none focus:border-primary transition-colors text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 resize-none h-20"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => handleSubmitFeedback(true)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Skip Feedback
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitFeedback(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-[#FF5A3A] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <span>Submit & Complete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hidden print:block">
        <PrintTravelGuide trip={tripDetailInfo || undefined} addonData={addonData} />
      </div>
    </>
  )
}

export default ViewTrip