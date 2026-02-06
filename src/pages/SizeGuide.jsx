import { useRef } from 'react';
import './SizeGuide.css';

const SilhouetteSVG = ({ type }) => {
    // Shared styling for measurement lines
    const lineProps = {
        stroke: "var(--gold)",
        strokeWidth: "1.5",
        strokeDasharray: "3,2"
    };
    const dotProps = {
        r: "2.5",
        fill: "#000"
    };
    const labelProps = {
        fontSize: "9",
        fontWeight: "700",
        fill: "#555",
        textAnchor: "middle"
    };

    // Render different silhouettes based on type
    const renderSilhouette = () => {
        if (type === 'adult-female') {
            return (
                <svg viewBox="0 0 200 350" className="body-silhouette">
                    {/* Detailed Adult Female Silhouette */}
                    <path d="M100,25 C110,25 118,32 118,45 C118,55 110,65 100,65 C90,65 82,55 82,45 C82,32 90,25 100,25 M118,65 C135,65 150,75 158,105 L165,185 L155,190 L148,115 L145,115 C150,160 145,210 140,330 L115,330 L118,200 L112,200 L115,330 L85,330 L82,200 L88,200 L85,330 L60,330 C55,210 50,160 55,115 L52,115 L45,190 L35,185 L42,105 C50,75 65,65 82,65 Z" fill="#fcfcfc" stroke="#ccc" strokeWidth="1" />
                    {/* Gown Overlay */}
                    <path d="M82,70 Q100,65 118,70 L162,110 L150,200 L155,320 L45,320 L50,200 L38,110 Z" fill="none" stroke="#333" strokeWidth="0.8" strokeOpacity="0.4" />

                    {/* Measurements */}
                    <line x1="78" y1="110" x2="122" y2="110" {...lineProps} />
                    <circle cx="78" cy="110" {...dotProps} />
                    <circle cx="122" cy="110" {...dotProps} />
                    <text x="100" y="105" {...labelProps}>GÖĞÜS</text>

                    <line x1="105" y1="70" x2="105" y2="320" {...lineProps} />
                    <circle cx="105" cy="70" {...dotProps} />
                    <circle cx="105" cy="320" {...dotProps} />
                    <text x="108" y="195" {...labelProps} transform="rotate(90, 108, 195)">BOY UZUNLUĞU</text>

                    <line x1="120" y1="70" x2="158" y2="170" {...lineProps} />
                    <circle cx="120" cy="70" {...dotProps} />
                    <circle cx="158" cy="170" {...dotProps} />
                    <text x="150" y="115" {...labelProps} transform="rotate(70, 150, 115)">KOL UZUNLUĞU</text>
                </svg>
            );
        } else if (type === 'adult-male') {
            return (
                <svg viewBox="0 0 200 350" className="body-silhouette">
                    {/* Adult Male Silhouette */}
                    <path d="M100,20 C112,20 122,30 122,45 C122,58 112,68 100,68 C88,68 78,58 78,45 C78,30 88,20 100,20 M122,68 C145,68 165,80 170,115 L175,190 L162,195 L155,120 L150,120 L150,335 L120,335 L120,200 L115,200 L115,335 L85,335 L85,200 L80,200 L80,335 L50,335 L50,120 L45,120 L38,195 L25,190 L30,115 C35,80 55,68 78,68 Z" fill="#fcfcfc" stroke="#ccc" strokeWidth="1" />
                    {/* Gown Overlay */}
                    <path d="M78,72 Q100,68 122,72 L172,120 L158,210 L160,325 L40,325 L42,210 L28,120 Z" fill="none" stroke="#333" strokeWidth="0.8" strokeOpacity="0.4" />

                    {/* Measurements */}
                    <line x1="75" y1="120" x2="125" y2="120" {...lineProps} />
                    <circle cx="75" cy="120" {...dotProps} />
                    <circle cx="125" cy="120" {...dotProps} />
                    <text x="100" y="115" {...labelProps}>GÖĞÜS</text>

                    <line x1="105" y1="72" x2="105" y2="325" {...lineProps} />
                    <circle cx="105" cy="72" {...dotProps} />
                    <circle cx="105" cy="325" {...dotProps} />
                    <text x="108" y="195" {...labelProps} transform="rotate(90, 108, 195)">BOY UZUNLUĞU</text>

                    <line x1="125" y1="72" x2="162" y2="180" {...lineProps} />
                    <circle cx="125" cy="72" {...dotProps} />
                    <circle cx="162" cy="180" {...dotProps} />
                    <text x="155" y="120" {...labelProps} transform="rotate(70, 155, 120)">KOL UZUNLUĞU</text>
                </svg>
            );
        } else {
            // Child Silhouette (Default for İlkokul/Anaokul)
            return (
                <svg viewBox="0 0 200 350" className="body-silhouette">
                    {/* Child Silhouette */}
                    <path d="M100,30 C115,30 125,45 125,60 C125,75 115,90 100,90 C85,90 75,75 75,60 C75,45 85,30 100,30 M125,90 C140,90 155,100 160,130 L165,200 L152,205 L145,140 L140,140 L140,330 L115,330 L115,220 L85,220 L85,330 L60,330 L60,140 L55,140 L48,205 L35,200 L40,130 C45,100 60,90 75,90 Z" fill="#fcfcfc" stroke="#ccc" strokeWidth="1" />
                    {/* Gown Overlay */}
                    <path d="M75,95 Q100,90 125,95 L165,140 L150,220 L155,320 L45,320 L50,220 L35,140 Z" fill="none" stroke="#333" strokeWidth="0.8" strokeOpacity="0.4" />

                    {/* Measurements */}
                    <line x1="72" y1="140" x2="128" y2="140" {...lineProps} />
                    <circle cx="72" cy="140" {...dotProps} />
                    <circle cx="128" cy="140" {...dotProps} />
                    <text x="100" y="135" {...labelProps}>GÖĞÜS</text>

                    <line x1="105" y1="95" x2="105" y2="320" {...lineProps} />
                    <circle cx="105" cy="95" {...dotProps} />
                    <circle cx="105" cy="320" {...dotProps} />
                    <text x="108" y="210" {...labelProps} transform="rotate(90, 108, 210)">BOY UZUNLUĞU</text>

                    {type === 'anaokul' && (
                        <>
                            <line x1="125" y1="95" x2="155" y2="190" {...lineProps} />
                            <circle cx="125" cy="95" {...dotProps} />
                            <circle cx="155" cy="190" {...dotProps} />
                            <text x="150" y="135" {...labelProps} transform="rotate(70, 150, 135)">KOL UZUNLUĞU</text>
                        </>
                    )}
                </svg>
            );
        }
    };

    return <div className="diagram-container">{renderSilhouette()}</div>;
};

const KepDiagramSet = () => (
    <div className="kep-diagram-set">
        {/* Lise/Ortaokul Kep */}
        <div className="kep-diagram-item flex-col items-center">
            <svg viewBox="0 0 240 200" className="kep-svg high-fidelity">
                {/* Person Silhouette (Head/Shoulders) */}
                <path d="M120,80 C145,80 165,100 165,130 L165,200 L75,200 L75,130 C75,100 95,80 120,80" fill="none" stroke="#eee" strokeWidth="1.5" />
                {/* Kep Illustration */}
                <path d="M50,75 L120,45 L190,75 L120,105 Z" fill="#444" fillOpacity="0.1" stroke="#333" strokeWidth="2" />
                <path d="M85,88 L85,120 Q120,145 155,120 L155,88" fill="#444" fillOpacity="0.1" stroke="#333" strokeWidth="2" />

                {/* Measurement markers based on user image */}
                {/* BOY (Top Plate) */}
                <line x1="50" y1="65" x2="120" y2="35" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="3,2" />
                <circle cx="50" cy="65" r="3" fill="#000" />
                <circle cx="120" cy="35" r="3" fill="#000" />
                <text x="85" y="45" transform="rotate(-23, 85, 45)" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--navy)">BOY</text>

                {/* YÜKSEKLİK */}
                <line x1="200" y1="72" x2="200" y2="120" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="3,2" />
                <circle cx="200" cy="72" r="3" fill="#000" />
                <circle cx="200" cy="120" r="3" fill="#000" />
                <text x="212" y="96" transform="rotate(90, 212, 96)" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--navy)">YÜKSEKLİK</text>

                {/* ÇAP (Circular marker) */}
                <path d="M95,110 Q120,125 145,110" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="3,2" />
                <text x="120" y="140" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--navy)">ÇAP</text>
                <text x="160" y="105" fontSize="9" fontWeight="bold" fill="#777">LASTİK</text>
            </svg>
            <span className="kep-caption">LİSE / ORTAOKUL</span>
        </div>

        {/* İlkokul/Anaokul Kep */}
        <div className="kep-diagram-item flex-col items-center small">
            <svg viewBox="0 0 240 200" className="kep-svg high-fidelity">
                <path d="M120,90 C140,90 155,105 155,130 L155,200 L85,200 L85,130 C85,105 100,90 120,90" fill="none" stroke="#eee" strokeWidth="1.5" />
                <path d="M65,85 L120,60 L175,85 L120,110 Z" fill="#444" fillOpacity="0.1" stroke="#333" strokeWidth="2" />
                <path d="M95,95 L95,120 Q120,140 145,120 L145,95" fill="#444" fillOpacity="0.1" stroke="#333" strokeWidth="2" />

                {/* BOY */}
                <line x1="65" y1="75" x2="120" y2="50" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="3,2" />
                <circle cx="65" cy="75" r="3" fill="#000" />
                <circle cx="120" cy="50" r="3" fill="#000" />
                <text x="92" y="58" transform="rotate(-23, 92, 58)" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--navy)">BOY</text>

                {/* YÜKSEKLİK */}
                <line x1="185" y1="82" x2="185" y2="120" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="3,2" />
                <circle cx="185" cy="82" r="3" fill="#000" />
                <circle cx="185" cy="120" r="3" fill="#000" />
                <text x="197" y="101" transform="rotate(90, 197, 101)" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--navy)">YÜKSEKLİK</text>

                {/* ÇAP */}
                <path d="M100,112 Q120,126 140,112" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="3,2" />
                <text x="120" y="138" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--navy)">ÇAP</text>
            </svg>
            <span className="kep-caption">İLKOKUL / ANAOKULU</span>
        </div>
    </div>
);

const SizeGuide = () => {
    const sections = {
        lise: useRef(null),
        ortaokul: useRef(null),
        ilkokul: useRef(null),
        anaokul: useRef(null),
        kep: useRef(null),
    };

    const scrollToSection = (sectionId) => {
        sections[sectionId].current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sizeData = {
        lise: [
            { size: 'S', chest: '58', length: '104', sleeve: '74' },
            { size: 'M', chest: '60', length: '106', sleeve: '75' },
            { size: 'L', chest: '62', length: '108', sleeve: '76' },
            { size: 'XL', chest: '64', length: '110', sleeve: '77' },
        ],
        ortaokul: [
            { size: 'S', chest: '58', length: '92', sleeve: '71' },
            { size: 'M', chest: '59', length: '94', sleeve: '72' },
            { size: 'L', chest: '60', length: '96', sleeve: '73' },
        ],
        ilkokul: [
            { size: 'STANDART', chest: '52', length: '80', sleeve: '-' },
        ],
        anaokulu: [
            { size: 'STANDART', chest: '48', length: '70', sleeve: '52' },
        ],
        kep: [
            { type: 'LİSE / ORTAOKUL', size: '23 X 23', height: '10', diameter: '60' },
            { type: 'İLKOKUL / ANAOKULU', size: '21 X 21', height: '8', diameter: '54' },
        ]
    };

    return (
        <main className="size-guide-page">
            <section className="page-header header-short">
                <div className="container">
                    <h1>Beden Ölçüleri</h1>
                </div>
            </section>

            {/* Anchor Navigation Bar */}
            <nav className="anchor-nav-bar">
                <div className="container">
                    <div className="nav-bar-inner">
                        <button onClick={() => scrollToSection('lise')}>LİSE CÜBBE <span>⌄</span></button>
                        <button onClick={() => scrollToSection('ortaokul')}>ORTAOKUL CÜBBE <span>⌄</span></button>
                        <button onClick={() => scrollToSection('ilkokul')}>İLKOKUL CÜBBE <span>⌄</span></button>
                        <button onClick={() => scrollToSection('anaokul')}>ANAOKUL CÜBBE <span>⌄</span></button>
                        <button onClick={() => scrollToSection('kep')}>KEP <span>⌄</span></button>
                    </div>
                </div>
            </nav>

            <section className="size-guide-content-v2">
                <div className="container">

                    {/* Lise Section */}
                    <article className="guide-card" ref={sections.lise}>
                        <h2 className="guide-title">LİSE MEZUNİYET CÜBBESİ BEDEN ÖLÇÜSÜ</h2>
                        <div className="guide-layout">
                            <div className="diagram-col">
                                <SilhouetteSVG type="adult-female" />
                            </div>
                            <div className="table-col">
                                <table className="size-ref-table">
                                    <thead>
                                        <tr>
                                            <th>BEDEN</th>
                                            <th>GÖĞÜS (CM)</th>
                                            <th>BOY (CM)</th>
                                            <th>KOL (CM)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.lise.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="bold">{item.size}</td>
                                                <td>{item.chest}</td>
                                                <td>{item.length}</td>
                                                <td>{item.sleeve}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </article>

                    {/* Ortaokul Section */}
                    <article className="guide-card" ref={sections.ortaokul}>
                        <h2 className="guide-title">ORTAOKUL MEZUNİYET CÜBBESİ BEDEN ÖLÇÜSÜ</h2>
                        <div className="guide-layout">
                            <div className="diagram-col">
                                <SilhouetteSVG type="adult-male" />
                            </div>
                            <div className="table-col">
                                <table className="size-ref-table">
                                    <thead>
                                        <tr>
                                            <th>BEDEN</th>
                                            <th>GÖĞÜS (CM)</th>
                                            <th>BOY (CM)</th>
                                            <th>KOL (CM)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.ortaokul.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="bold">{item.size}</td>
                                                <td>{item.chest}</td>
                                                <td>{item.length}</td>
                                                <td>{item.sleeve}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </article>

                    {/* İlkokul Section */}
                    <article className="guide-card" ref={sections.ilkokul}>
                        <h2 className="guide-title">İLKOKUL MEZUNİYET CÜBBESİ BEDEN ÖLÇÜSÜ</h2>
                        <div className="guide-layout">
                            <div className="diagram-col">
                                <SilhouetteSVG type="child" />
                            </div>
                            <div className="table-col">
                                <table className="size-ref-table">
                                    <thead>
                                        <tr>
                                            <th>BEDEN</th>
                                            <th>GÖĞÜS (CM)</th>
                                            <th>BOY (CM)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.ilkokul.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="bold">{item.size}</td>
                                                <td>{item.chest}</td>
                                                <td>{item.length}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </article>

                    {/* Anaokul Section */}
                    <article className="guide-card" ref={sections.anaokul}>
                        <h2 className="guide-title">ANAOKUL MEZUNİYET CÜBBESİ BEDEN ÖLÇÜSÜ</h2>
                        <div className="guide-layout">
                            <div className="diagram-col">
                                <SilhouetteSVG type="anaokul" />
                            </div>
                            <div className="table-col">
                                <table className="size-ref-table">
                                    <thead>
                                        <tr>
                                            <th>BEDEN</th>
                                            <th>GÖĞÜS (CM)</th>
                                            <th>BOY (CM)</th>
                                            <th>KOL (CM)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.anaokulu.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="bold">{item.size}</td>
                                                <td>{item.chest}</td>
                                                <td>{item.length}</td>
                                                <td>{item.sleeve}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </article>

                    {/* Kep Section */}
                    <article className="guide-card" ref={sections.kep}>
                        <h2 className="guide-title">KEP ÖLÇÜLERİ</h2>
                        <div className="guide-layout kep-layout">
                            <div className="diagram-row">
                                <KepDiagramSet />
                            </div>
                            <div className="table-row">
                                <table className="size-ref-table">
                                    <thead>
                                        <tr>
                                            <th>KADEME</th>
                                            <th>BOY (CM)</th>
                                            <th>YÜKSEKLİK (CM)</th>
                                            <th>ÇAP (CM)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.kep.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="bold">{item.type}</td>
                                                <td>{item.size}</td>
                                                <td>{item.height}</td>
                                                <td>{item.diameter}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </article>

                </div>
            </section>
        </main>
    );
};

export default SizeGuide;
