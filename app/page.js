"use client"
import { useState } from 'react';

export default function Home() {
    const sampleEntries = {
        "texts": [
            "The causes of mortality in the army in the East: preventable diseases outrank all other causes",
            "Good morning! I trust your coffee has been strong and your emails short",
            "She's (cough) just a friend",
            "I'm in love but I'm feeling low For I am just a footprint in the snow I'm in love with us by now But that's a feeling I can never show For a reality between lucky me I'm searching for planes in the sea and that's it Soil just needs water to be and a seed So if we turn into a tree can I be the leaves?",
            "My sales manager would hate this email and that's why it's perfect",
            "The waves broke and spread their waters swiftly over the shore. One after another, they massed themselves and fell; the spray tossed itself back with the energy of their fall.",
            "The waves broke and spread their waters swiftly over the shore. One after another, they massed themselves and fell; the spray tossed itself back with the energy of their fall.",
            "The world will little note, nor long remember what we say here, but it can never forget what they did here.",
            "The causes of mortality in the army in the East: preventable diseases outrank all other causes",
            "Each petal of the rose chart blossoms with death, showing where sanitation failed* (*Statistical data given the emotional power of a flower.",
            "We are like people living in a cave, watching shadows on the wall, mistaking them for reality* (*Reality reimagined as an illusion of flickering shadows.",
            "One is not born, but rather becomes, a woman.",
            "One is not born, but rather becomes, a woman.",
            "I hear the approaching thunder that, one day, will destroy us too.",
            "Here's to the crazy ones. The misfits. The rebels. The troublemakers. They push the human race forward",
            "Gold-threaded gowns gleam in defiance of laws, their wearers cloaked in rebellion.",
            "One is not born, but rather becomes, a woman.",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms",
            "Cooking is balance. Salt brightens. Fat enriches. Acid sharpens. Heat transforms"
        ]
    }

    // const filteredEntries = sampleEntries.texts.filter((text) =>
    //     text.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <div className="min-h-screen">
            {/* Grid container */}
            <main className="p-20">
                <div className="grid grid-cols-5 gap-3">
                    {sampleEntries.texts.map((text, index) => (
                        <div
                            key={index}
                            className="aspect-square bg-white rounded-[16px] border-[1px] border-black p-5 overflow-scroll"
                        >
                            <p className="font-medium">{text}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
