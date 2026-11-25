"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import MediaUploader, { MediaItem } from "@/components/admin/MediaUploader";

const basePropertySchema = z.object({
  id: z.string().min(3, "ID must be at least 3 characters"),
  price: z.string(),
  address: z.string(),
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
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  projectSlug: z.string().nullable().optional(),
  principal: z.object({
    name: z.string().default(""),
    title: z.string().default(""),
    phone: z.string().default(""),
  }),
  description: z.string(),
  publicationStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    message: "Please select a valid publication status",
  }),
});

interface RoomRow {
  heading: string;
  body: string;
}

interface FloorPlanRow {
  title: string;
  image: string;
}

interface ProjectOption {
  slug: string;
  name: string;
  url: string;
}

const propertySchema = basePropertySchema.superRefine((data, ctx) => {
  if (data.publicationStatus === "PUBLISHED") {
    if (!data.price || data.price.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price is required to publish",
        path: ["price"],
      });
    }
    if (!data.address || data.address.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address is required to publish",
        path: ["address"],
      });
    }
    if (!data.description || data.description.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description (min 10 chars) is required to publish",
        path: ["description"],
      });
    }
  }
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
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [floorPlans, setFloorPlans] = useState<FloorPlanRow[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);

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
      lat: 6.45,
      lng: 3.42,
      projectSlug: null,
      principal: { name: "", title: "", phone: "" },
      description: "",
      publicationStatus: "DRAFT",
    }
  });

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : []))
      .then(setProjects)
      .catch(() => setProjects([]));

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
            if (Array.isArray(data.rooms)) {
              setRooms(data.rooms);
            }
            if (Array.isArray(data.floorPlans)) {
              setFloorPlans(data.floorPlans);
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
      const activeMedia = media.filter(m => !m.isDeleted);

      if (data.publicationStatus === "PUBLISHED" && activeMedia.length === 0) {
        setError("At least one image is required to publish a property.");
        setIsSubmitting(false);
        return;
      }

      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/properties" : `/api/properties/${params.id}`;
      
      const coverImage = activeMedia.find(m => m.isCover)?.url || activeMedia[0]?.url || null;

      const cleanRooms = rooms.filter(r => r.heading.trim() || r.body.trim());
      const cleanFloorPlans = floorPlans.filter(f => f.title.trim() || f.image.trim());

      const payload = isNew ? {
        ...data,
        projectSlug: data.projectSlug || null,
        imagePlaceholder: "property-placeholder.jpg",
        image: coverImage,
        photoCount: activeMedia.length,
        rooms: cleanRooms,
        gallery: [],
        floorPlans: cleanFloorPlans,
        media: activeMedia,
      } : {
        ...data,
        projectSlug: data.projectSlug || null,
        media: activeMedia,
        image: coverImage,
        photoCount: activeMedia.length,
        rooms: cleanRooms,
        floorPlans: cleanFloorPlans,
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
        <Link href="/admin/properties" className="p-2 bg-white border border-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            {isNew ? "New Property" : "Edit Property"}
          </h1>
          <p className="text-neutral-500 mt-1">
            {isNew ? "Add a new property to the portfolio." : "Update existing property details."}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white border border-neutral-200 rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Property ID (slug)</label>
            <input 
              {...register("id")} 
              disabled={!isNew}
              className={`w-full bg-white border ${errors.id ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors disabled:opacity-50`} 
              placeholder="e.g. ikoyi-villa-1" 
            />
            {errors.id && <p className="text-sm text-red-500">{errors.id.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Display Price (String)</label>
            <input 
              {...register("price")} 
              className={`w-full bg-white border ${errors.price ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`} 
              placeholder="e.g. $1,500,000" 
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-700">Address</label>
            <input 
              {...register("address")} 
              className={`w-full bg-white border ${errors.address ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`} 
              placeholder="e.g. 123 Banana Island Road" 
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Neighbourhood</label>
            <input 
              {...register("neighbourhood")} 
              className={`w-full bg-white border ${errors.neighbourhood ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`} 
              placeholder="e.g. Banana Island" 
            />
            {errors.neighbourhood && <p className="text-sm text-red-500">{errors.neighbourhood.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">City</label>
            <input 
              {...register("city")} 
              className={`w-full bg-white border ${errors.city ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`} 
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Listing Status</label>
            <select 
              {...register("status")} 
              className={`w-full bg-white border ${errors.status ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`}
            >
              <option value="For Sale">For Sale</option>
              <option value="For Lease">For Lease</option>
              <option value="Off-Plan">Off-Plan</option>
            </select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Publication Status</label>
            <select 
              {...register("publicationStatus")} 
              className={`w-full bg-white border ${errors.publicationStatus ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`}
            >
              <option value="DRAFT">Draft (Hidden)</option>
              <option value="PUBLISHED">Published (Visible)</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            {errors.publicationStatus && <p className="text-sm text-red-500">{errors.publicationStatus.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Type</label>
            <select 
              {...register("type")} 
              className={`w-full bg-white border ${errors.type ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`}
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
            <label className="text-sm font-medium text-neutral-700">Bedrooms</label>
            <input 
              type="number"
              {...register("beds")} 
              className={`w-full bg-white border ${errors.beds ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`} 
            />
            {errors.beds && <p className="text-sm text-red-500">{errors.beds.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Bathrooms</label>
            <input 
              type="number"
              {...register("baths")} 
              className={`w-full bg-white border ${errors.baths ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`} 
            />
            {errors.baths && <p className="text-sm text-red-500">{errors.baths.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Numeric Price Value (for sorting/analytics)</label>
            <input 
              type="number"
              {...register("priceValue")} 
              className={`w-full bg-white border ${errors.priceValue ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`} 
            />
            {errors.priceValue && <p className="text-sm text-red-500">{errors.priceValue.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Development / Project</label>
            <select
              {...register("projectSlug")}
              className="w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-3 text-neutral-900 transition-colors"
            >
              <option value="">None — standalone listing</option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} ({p.url})
                </option>
              ))}
            </select>
            <p className="text-xs text-neutral-400">
              Links this listing to a project page — shows the project banner and shared site media on the property page.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Latitude</label>
            <input
              type="number" step="any"
              {...register("lat")}
              className={`w-full bg-white border ${errors.lat ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Longitude</label>
            <input
              type="number" step="any"
              {...register("lng")}
              className={`w-full bg-white border ${errors.lng ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors`}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-700">Listing Principal</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                {...register("principal.name")}
                placeholder="Name"
                className="w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-3 text-neutral-900 transition-colors"
              />
              <input
                {...register("principal.title")}
                placeholder="Title (e.g. Key Principal)"
                className="w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-3 text-neutral-900 transition-colors"
              />
              <input
                {...register("principal.phone")}
                placeholder="Phone"
                className="w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-3 text-neutral-900 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-700">Description</label>
            <textarea 
              {...register("description")} 
              rows={4}
              className={`w-full bg-white border ${errors.description ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'} rounded-lg px-4 py-3 text-neutral-900 transition-colors resize-none`} 
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-200">
          <MediaUploader media={media} onChange={setMedia} />
        </div>

        {/* Interior details — renders in the "Interior Details" card on the property page */}
        <div className="pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-off-white">Interior Details</h3>
              <p className="text-sm text-neutral-500">Sections shown on the property page (e.g. &quot;Ground &amp; Lower Floors&quot;).</p>
            </div>
            <button
              type="button"
              onClick={() => setRooms([...rooms, { heading: "", body: "" }])}
              className="flex items-center gap-2 bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-md hover:border-neutral-900 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add section
            </button>
          </div>
          <div className="space-y-4">
            {rooms.map((room, i) => (
              <div key={i} className="border border-neutral-200 rounded-lg p-4 space-y-3 bg-neutral-50">
                <div className="flex items-center gap-3">
                  <input
                    value={room.heading}
                    onChange={(e) => setRooms(rooms.map((r, j) => j === i ? { ...r, heading: e.target.value } : r))}
                    placeholder="Section heading"
                    className="flex-1 bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-2.5 text-neutral-900 text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setRooms(rooms.filter((_, j) => j !== i))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={room.body}
                  onChange={(e) => setRooms(rooms.map((r, j) => j === i ? { ...r, body: e.target.value } : r))}
                  placeholder="Section body — what is on these floors, materials, features…"
                  rows={3}
                  className="w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-2.5 text-neutral-900 text-sm transition-colors resize-none"
                />
              </div>
            ))}
            {rooms.length === 0 && (
              <p className="text-sm text-neutral-400 italic">No sections yet — the property page will only show the overview.</p>
            )}
          </div>
        </div>

        {/* Floor plans */}
        <div className="pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-off-white">Architectural Plans</h3>
              <p className="text-sm text-neutral-500">One entry per floor — image path (upload via Media above and copy its URL, or use /images/…).</p>
            </div>
            <button
              type="button"
              onClick={() => setFloorPlans([...floorPlans, { title: "", image: "" }])}
              className="flex items-center gap-2 bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-md hover:border-neutral-900 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add plan
            </button>
          </div>
          <div className="space-y-3">
            {floorPlans.map((plan, i) => (
              <div key={i} className="flex items-center gap-3 border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                <input
                  value={plan.title}
                  onChange={(e) => setFloorPlans(floorPlans.map((f, j) => j === i ? { ...f, title: e.target.value } : f))}
                  placeholder="Plan title (e.g. Ground Floor)"
                  className="w-56 bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-2.5 text-neutral-900 text-sm transition-colors"
                />
                <input
                  value={plan.image}
                  onChange={(e) => setFloorPlans(floorPlans.map((f, j) => j === i ? { ...f, image: e.target.value } : f))}
                  placeholder="/images/plan.webp or uploaded media URL"
                  className="flex-1 bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-4 py-2.5 text-neutral-900 text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setFloorPlans(floorPlans.filter((_, j) => j !== i))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Remove plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {floorPlans.length === 0 && (
              <p className="text-sm text-neutral-400 italic">No floor plans — the plans viewer will be hidden on the page.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-700 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Property
          </button>
        </div>
      </form>
    </div>
  );
}
