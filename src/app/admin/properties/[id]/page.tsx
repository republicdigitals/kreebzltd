"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import MediaUploader, { MediaItem } from "@/components/admin/MediaUploader";

const propertySchema = z.object({
  id: z.string().min(3, "ID must be at least 3 characters"),
  price: z.string().min(1, "Price is required"),
  address: z.string().min(5, "Address is required"),
  neighbourhood: z.string().min(1, "Neighbourhood is required"),
  city: z.string().min(1, "City is required"),
  beds: z.coerce.number().min(0, "Must be at least 0"),
  baths: z.coerce.number().min(0, "Must be at least 0"),
  status: z.enum(["For Sale", "For Lease", "Off-Plan"], {
    message: "Please select a valid status",
  }),
  type: z.enum(["House", "Apartment", "Penthouse", "Villa", "Townhouse"], {
    message: "Please select a valid type",
  }),
  priceValue: z.coerce.number().min(0, "Must be a valid number"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  publicationStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    message: "Please select a valid publication status",
  }),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function PropertyEditor() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const [loadingData, setLoadingData] = useState(!isNew);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      id: "",
      price: "",
      address: "",
      neighbourhood: "",
      city: "Lagos, Nigeria",
      beds: 0,
      baths: 0,
      status: "For Sale",
      type: "House",
      priceValue: 0,
      description: "",
      publicationStatus: "DRAFT",
    }
  });

  useEffect(() => {
    if (!isNew) {
      const fetchProperty = async () => {
        try {
          const res = await fetch(`/api/properties/${params.id}`);
          if (res.ok) {
            const data = await res.json();
            reset(data);
            if (data.media) {
              setMedia(data.media);
            }
          } else {
            setError("Property not found");
          }
        } catch {
          setError("Failed to load property");
        } finally {
          setLoadingData(false);
        }
      };
      fetchProperty();
    }
  }, [isNew, params.id, reset]);

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/properties" : `/api/properties/${params.id}`;
      
      const activeMedia = media.filter(m => !m.isDeleted);
      const coverImage = activeMedia.find(m => m.isCover)?.url || activeMedia[0]?.url || null;

      const payload = isNew ? {
        ...data,
        lat: 6.45,
        lng: 3.42,
        imagePlaceholder: "property-placeholder.jpg",
        image: coverImage,
        photoCount: activeMedia.length,
        rooms: [],
        gallery: [],
        floorPlans: [],
        media: activeMedia,
        principal: {
          name: "Admin User",
          title: "Kreebz Principal",
          phone: "+234 800 000 0000"
        }
      } : { 
        ...data, 
        media: activeMedia,
        image: coverImage,
        photoCount: activeMedia.length
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save property");
      }

      router.push("/admin/properties");
      router.refresh(); // Refresh to update server components if any
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return <div className="p-8 text-neutral-400">Loading property data...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isNew ? "New Property" : "Edit Property"}
          </h1>
          <p className="text-neutral-400 mt-1">
            {isNew ? "Add a new property to the portfolio." : "Update existing property details."}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-neutral-900 border border-neutral-800 rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Property ID (slug)</label>
            <input 
              {...register("id")} 
              disabled={!isNew}
              className={`w-full bg-neutral-950 border ${errors.id ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors disabled:opacity-50`} 
              placeholder="e.g. ikoyi-villa-1" 
            />
            {errors.id && <p className="text-sm text-red-500">{errors.id.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Display Price (String)</label>
            <input 
              {...register("price")} 
              className={`w-full bg-neutral-950 border ${errors.price ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`} 
              placeholder="e.g. $1,500,000" 
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-300">Address</label>
            <input 
              {...register("address")} 
              className={`w-full bg-neutral-950 border ${errors.address ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`} 
              placeholder="e.g. 123 Banana Island Road" 
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Neighbourhood</label>
            <input 
              {...register("neighbourhood")} 
              className={`w-full bg-neutral-950 border ${errors.neighbourhood ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`} 
              placeholder="e.g. Banana Island" 
            />
            {errors.neighbourhood && <p className="text-sm text-red-500">{errors.neighbourhood.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">City</label>
            <input 
              {...register("city")} 
              className={`w-full bg-neutral-950 border ${errors.city ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`} 
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Listing Status</label>
            <select 
              {...register("status")} 
              className={`w-full bg-neutral-950 border ${errors.status ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`}
            >
              <option value="For Sale">For Sale</option>
              <option value="For Lease">For Lease</option>
              <option value="Off-Plan">Off-Plan</option>
            </select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Publication Status</label>
            <select 
              {...register("publicationStatus")} 
              className={`w-full bg-neutral-950 border ${errors.publicationStatus ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`}
            >
              <option value="DRAFT">Draft (Hidden)</option>
              <option value="PUBLISHED">Published (Visible)</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            {errors.publicationStatus && <p className="text-sm text-red-500">{errors.publicationStatus.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Type</label>
            <select 
              {...register("type")} 
              className={`w-full bg-neutral-950 border ${errors.type ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`}
            >
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
            </select>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Bedrooms</label>
            <input 
              type="number"
              {...register("beds")} 
              className={`w-full bg-neutral-950 border ${errors.beds ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`} 
            />
            {errors.beds && <p className="text-sm text-red-500">{errors.beds.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Bathrooms</label>
            <input 
              type="number"
              {...register("baths")} 
              className={`w-full bg-neutral-950 border ${errors.baths ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`} 
            />
            {errors.baths && <p className="text-sm text-red-500">{errors.baths.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-300">Numeric Price Value (for sorting/analytics)</label>
            <input 
              type="number"
              {...register("priceValue")} 
              className={`w-full bg-neutral-950 border ${errors.priceValue ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors`} 
            />
            {errors.priceValue && <p className="text-sm text-red-500">{errors.priceValue.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-300">Description</label>
            <textarea 
              {...register("description")} 
              rows={4}
              className={`w-full bg-neutral-950 border ${errors.description ? 'border-red-500' : 'border-neutral-800 focus:border-white'} rounded-lg px-4 py-3 text-white transition-colors resize-none`} 
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800">
          <MediaUploader media={media} onChange={setMedia} />
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-800">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Property
          </button>
        </div>
      </form>
    </div>
  );
}
