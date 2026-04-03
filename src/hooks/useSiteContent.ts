import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SectionContent {
    title?: string;
    html?: string;
    text?: string;
    image_url?: string;
    background_color?: string;
    text_color?: string;
    button_text?: string;
    button_url?: string;
    subtitle?: string;
}

interface PageSection {
    id: string;
    page: string;
    section: string;
    type: string;
    content: SectionContent;
    order_index: number;
}

export const useSiteContent = (page: string) => {
    const [sections, setSections] = useState<PageSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [sectionMap, setSectionMap] = useState<Record<string, PageSection>>({});

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("site_content")
                .select("*")
                .eq("page", page)
                .order("order_index", { ascending: true });

            if (error) {
                console.error(`Failed to load content for page: ${page}`, error);
            } else {
                const fetched = (data as PageSection[]) || [];
                setSections(fetched);

                // Build a map for easy access: sectionMap["hero"] → section
                const map: Record<string, PageSection> = {};
                fetched.forEach((s) => {
                    map[s.section] = s;
                });
                setSectionMap(map);
            }
            setLoading(false);
        };

        fetchContent();
    }, [page]);

    // Helper to get a single section by name
    const getSection = (sectionName: string): PageSection | null => {
        return sectionMap[sectionName] ?? null;
    };

    // Helper to get content of a section directly
    const getContent = (sectionName: string): SectionContent => {
        return sectionMap[sectionName]?.content ?? {};
    };

    return { sections, sectionMap, loading, getSection, getContent };
};
