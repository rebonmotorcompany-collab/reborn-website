'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Truck, Users, Award, DollarSign, Headset } from 'lucide-react';

interface WhyChooseUsProps {
  lang: string;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ lang }) => {
  const cards = [
    {
      icon: <Award className="text-[#D72626]" size={24} />,
      title: lang === 'en' ? 'Premium Quality' : 'پریمیم معیار',
      desc: lang === 'en' ? 'Engineered in partnership with top Japanese component suppliers, meeting global ISO 9001 quality guidelines.' : 'اعلی جاپانی اسپیئر پارٹس کے اشتراک سے تیار کردہ، آئی ایس او 9001 کے معیار کے مطابق۔',
    },
    {
      icon: <Truck className="text-[#D72626]" size={24} />,
      title: lang === 'en' ? 'Fast Delivery' : 'فوری ترسیل',
      desc: lang === 'en' ? 'Our modern logistics channels guarantee secure delivery of your vehicle within 3 to 5 business days anywhere in Pakistan.' : 'ہمارا جدید لاجسٹکس نیٹ ورک 3 سے 5 دنوں میں آپ کی بائیک کی محفوظ ترسیل یقینی بناتا ہے۔',
    },
    {
      icon: <Users className="text-[#D72626]" size={24} />,
      title: lang === 'en' ? 'Trusted Dealers' : 'بھروسہ مند ڈیلرز',
      desc: lang === 'en' ? 'Over 100+ authorized showrooms across Pakistan offering standard premium sale and genuine service support.' : 'پاکستان بھر میں 100 سے زیادہ مجاز ڈیلرز جو مستند پریمیم سیل اور سروس اسسٹنس فراہم کرتے ہیں۔',
    },
    {
      icon: <Shield className="text-[#D72626]" size={24} />,
      title: lang === 'en' ? '3 Years Warranty' : '3 سال کی وارنٹی',
      desc: lang === 'en' ? 'Comprehensive 3-year warranty on batteries, motor core, and chassis layout to give you complete peace of mind.' : 'بیٹریوں، موٹر اور چیسس پر 3 سال کی جامع وارنٹی جو آپ کو مکمل ذہنی سکون فراہم کرتی ہے۔',
    },
    {
      icon: <DollarSign className="text-[#D72626]" size={24} />,
      title: lang === 'en' ? 'Affordable Pricing' : 'مناسب قیمت',
      desc: lang === 'en' ? 'Highly competitive local manufacturing and low running costs, making high-end mobility accessible for everyone.' : 'مقامی مینوفیکچرنگ کی بدولت انتہائی مناسب اور سستی قیمتیں اور کم ترین سفری اخراجات۔',
    },
    {
      icon: <Headset className="text-[#D72626]" size={24} />,
      title: lang === 'en' ? 'Excellent Support' : 'بہترین سپورٹ',
      desc: lang === 'en' ? 'Dedicated helpline and complimentary 24/7 Roadside Assistance for any flat tires, battery swaps, or breakdowns.' : 'خصوصی ہیلپ لائن اور پہلے سال کے لیے چوبیس گھنٹے مفت روڈ سائیڈ اسسٹنس سروس۔',
    },
  ];

  return (
    <section className="py-24 bg-[#F5F5F5] dark:bg-[#0E0E0E] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black text-[#D72626] uppercase tracking-[0.25em] mb-2 block">
            {lang === 'en' ? 'RMC Advantage' : 'ہمارا امتیاز'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-neutral-900 dark:text-white uppercase">
            {lang === 'en' ? 'Why Choose Rebon Motor' : 'ریبرن موٹر کا انتخاب کیوں؟'}
          </h2>
          <div className="w-16 h-1 bg-[#D72626] mx-auto mt-4 rounded-full" />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm hover:border-[#D72626]/40 dark:hover:border-[#D72626]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold font-display text-neutral-900 dark:text-white uppercase mb-3">
                {card.title}
              </h3>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
