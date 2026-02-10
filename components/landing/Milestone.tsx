import React from 'react'

type Props = {}

const Milestone = (props: Props) => {

    const milestones = [
    { year: '2022', title: 'Peluncuran Beta', desc: 'Uji coba di 5 posyandu' },
    { year: '2023', title: 'Ekspansi Nasional', desc: 'Hadir di 100+ kota' },
    { year: '2024', title: 'Pencapaian Gemilang', desc: '10,000+ keluarga terdaftar' },
    { year: '2025', title: 'Visi Masa Depan', desc: 'Indonesia bebas stunting' }
  ];
  
  return (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold heading-font gradient-text mb-4">
              Perjalanan Kami
            </h2>
            <p className="text-xl text-gray-600">Dari ide hingga dampak nasional</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500"></div>
            
            {milestones.map((milestone, idx) => (
              <div key={idx} className={`flex items-center mb-12 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${idx % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="bg-white rounded-2xl shadow-xl p-6 card-hover">
                    <div className={`text-3xl font-bold gradient-text mb-2`}>{milestone.year}</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h4>
                    <p className="text-gray-600">{milestone.desc}</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full absolute left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg z-10"></div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Milestone