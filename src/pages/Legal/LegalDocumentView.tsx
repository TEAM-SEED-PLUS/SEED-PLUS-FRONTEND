import type { LegalBlock, LegalSection } from '@/content/legalTypes';

const BlockView = ({ block }: { block: LegalBlock }) => {
  if (block.kind === 'paragraph') {
    return (
      <p className="mt-3 text-sm leading-relaxed text-[#4e5968] first:mt-0">
        {block.text}
      </p>
    );
  }

  if (block.kind === 'list') {
    return (
      <ul className="mt-3 space-y-2">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm leading-relaxed text-[#4e5968]"
          >
            <span
              aria-hidden
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b0b8c1]"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.kind === 'notice') {
    return (
      <p className="mt-3 rounded-md border border-[#f5c518] bg-[#fff8e1] px-4 py-3 text-sm leading-relaxed font-medium text-[#8a6d00]">
        {block.text}
      </p>
    );
  }

  return (
    // 모바일에서는 표가 넘치므로 가로 스크롤을 허용한다.
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-xs">
        <thead>
          <tr className="bg-[#f2f4f6]">
            {block.headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border border-[#e5e8eb] px-3 py-2 font-bold text-[#333d4b]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-[#e5e8eb] px-3 py-2 leading-relaxed text-[#4e5968] align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LegalDocumentView = ({ sections }: { sections: LegalSection[] }) => (
  <div className="space-y-8">
    {sections.map((section) => (
      <section key={section.id} id={section.id} className="scroll-mt-24">
        <h2 className="text-base font-extrabold text-[#191f28]">
          {section.title}
        </h2>
        <div className="mt-2">
          {section.blocks.map((block, index) => (
            <BlockView key={index} block={block} />
          ))}
        </div>
      </section>
    ))}
  </div>
);

export default LegalDocumentView;
