import { Fragment } from "react";

/**
 * Renderer teks sederhana untuk isi artikel.
 *
 * Sengaja tidak memakai library markdown: kebutuhannya hanya paragraf, dua
 * tingkat judul, kutipan, dan daftar. Karena input diproses sebagai teks biasa
 * (bukan dangerouslySetInnerHTML), tidak ada celah HTML injection dari konten
 * yang diketik di admin panel.
 *
 * Sintaks yang didukung:
 *   ## Judul      → h2
 *   ### Judul     → h3
 *   > Kutipan     → blockquote
 *   - item        → daftar berpoin
 *   1. item       → daftar bernomor
 *   **tebal**     → <strong>
 *   *miring*      → <em>
 */

type Block =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

type ListBlock = Extract<Block, { type: "ul" | "ol" }>;

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  // Buffer paragraf & daftar yang sedang dikumpulkan. Disimpan dalam objek
  // agar penyempitan tipe TypeScript tidak hilang saat dimutasi lintas iterasi.
  const buf: { paragraph: string[]; list: ListBlock | null } = { paragraph: [], list: null };

  const flushParagraph = () => {
    if (buf.paragraph.length) {
      blocks.push({ type: "p", text: buf.paragraph.join(" ") });
      buf.paragraph = [];
    }
  };
  const flushList = () => {
    if (buf.list) {
      blocks.push(buf.list);
      buf.list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);

    if (bullet || numbered) {
      flushParagraph();
      const type: ListBlock["type"] = bullet ? "ul" : "ol";
      const text = (bullet ?? numbered)![1];

      if (buf.list && buf.list.type === type) {
        buf.list.items.push(text);
      } else {
        flushList();
        buf.list = { type, items: [text] };
      }
      continue;
    }

    flushList();

    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "h3", text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (line.startsWith("> ")) {
      flushParagraph();
      blocks.push({ type: "quote", text: line.slice(2) });
    } else {
      buf.paragraph.push(line);
    }
  }

  flushParagraph();
  flushList();
  return blocks;
}

/** **tebal** dan *miring* → elemen React, bukan string HTML. */
function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function RichText({ content }: { content: string }) {
  const blocks = parse(content);

  return (
    <div className="prose-jp">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return <h2 key={i}>{inline(block.text)}</h2>;
          case "h3":
            return <h3 key={i}>{inline(block.text)}</h3>;
          case "quote":
            return <blockquote key={i}>{inline(block.text)}</blockquote>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{inline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{inline(item)}</li>
                ))}
              </ol>
            );
          default:
            return <p key={i}>{inline(block.text)}</p>;
        }
      })}
    </div>
  );
}
