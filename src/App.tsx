/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  LogOut, 
  PlusCircle, 
  LayoutDashboard, 
  Settings as SettingsIcon,
  Phone,
  ChevronRight,
  User,
  Heart,
  History,
  ShoppingBag,
  Moon,
  Sun,
  ShieldCheck,
  ImageIcon,
  Bell,
  Star
} from 'lucide-react';
import { Project, ViewMode, SiteSettings, Promotion, SettingsTab } from './types';

export default function App() {
  const [view, setView] = useState<ViewMode>('public');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    contactPhone: '1900 1234',
    consultantPhone: '0901 234 567'
  });
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePromo, setActivePromo] = useState<Promotion | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('admin@vinhomes.vn');
  const [loginPass, setLoginPass] = useState('123456');
  const [newProject, setNewProject] = useState<Partial<Project>>({
    type: 'Căn hộ', status: 'MỚI', beds: 2, baths: 2, area: 75, price: 3.5, imageUrl: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [projRes, promoRes, siteRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/promotions'),
        fetch('/api/site-settings')
      ]);
      setProjects(await projRes.json());
      setPromotions(await promoRes.json());
      setSiteSettings(await siteRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });
      if (res.ok) {
        setIsLoggedIn(true);
        setSettingsTab('admin');
        setView('settings');
      } else {
        alert("Thử lại với: admin@vinhomes.vn / 123456");
      }
    } catch (e) { alert("Lỗi kết nối"); }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings)
      });
      if (res.ok) alert("Đã cập nhật hệ thống!");
    } catch (e) { alert("Lỗi cập nhật"); }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        alert("Đã đăng dự án thành công!");
        fetchInitialData();
        setView('public');
      }
    } catch (e) { alert("Lỗi đăng tin"); }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Promo Banner Slider (Static Demo) */}
      {view === 'public' && promotions.length > 0 && (
        <div className="bg-vin-navy text-white py-3 overflow-hidden border-b border-white/10 relative">
          <div className="container mx-auto px-6 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-8 items-center">
            {promotions.map((promo) => (
              <button 
                key={promo.id} 
                onClick={() => setActivePromo(promo)}
                className="flex items-center gap-3 hover:text-vin-gold transition-colors text-xs font-bold uppercase tracking-widest"
              >
                <Star size={14} className="text-vin-gold fill-vin-gold" />
                {promo.title}
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 h-16 flex items-center border-b shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div 
            className="text-2xl font-extrabold text-vin-navy tracking-tight cursor-pointer flex items-center gap-2"
            onClick={() => setView('public')}
          >
            VINREAL <span className={darkMode ? 'text-white' : 'text-vin-gold'}>ELITE</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
              <button onClick={() => setView('public')} className="hover:text-vin-navy active:scale-95 transition-all">Trang chủ</button>
              <button className="hover:text-vin-navy active:scale-95 transition-all">Dự án</button>
              <button className="hover:text-vin-navy active:scale-95 transition-all">Hotline: {siteSettings.contactPhone}</button>
            </div>
            
            <button 
              onClick={() => setView('settings')}
              className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
            >
              <User size={22} className={darkMode ? 'text-white' : 'text-vin-navy'} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {view === 'settings' ? (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12"
          >
            {/* Settings Sidebar */}
            <aside className="w-full lg:w-72 shrink-0 space-y-1">
              <div className="mb-8 px-4">
                <h2 className="text-xl font-extrabold">Cài đặt</h2>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>Quản lý tài khoản & hệ thống</p>
              </div>
              
              {[
                { id: 'profile', icon: User, label: 'Thông tin cá nhân' },
                { id: 'favorites', icon: Heart, label: 'Yêu thích' },
                { id: 'history', icon: History, label: 'Lịch sử xem' },
                { id: 'purchases', icon: ShoppingBag, label: 'Lịch sử mua hàng' },
                { id: 'interface', icon: Moon, label: 'Giao diện' },
                { id: 'admin', icon: ShieldCheck, label: 'Quản trị viên' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSettingsTab(tab.id as SettingsTab)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                    settingsTab === tab.id 
                    ? (darkMode ? 'bg-vin-gold text-white shadow-lg' : 'bg-vin-navy text-white shadow-lg')
                    : (darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50')
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </aside>

            {/* Settings Content Pane */}
            <main className={`flex-1 p-10 rounded-[32px] overflow-hidden ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-100 shadow-sm'}`}>
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {settingsTab === 'profile' && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key="profile" className="space-y-8">
                    <div className="border-b border-gray-100 pb-6 mb-8">
                      <h3 className="text-2xl font-extrabold">Hồ sơ khách hàng</h3>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Quản lý thông tin cá nhân của bạn để nhận dịch vụ tốt nhất từ Vinhomes</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Họ và tên</label>
                        <input type="text" className={`w-full px-5 py-4 rounded-2xl outline-none border transition-all focus:ring-2 focus:ring-vin-gold ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`} placeholder="Nguyễn Văn A" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Địa chỉ Email</label>
                        <input type="email" className={`w-full px-5 py-4 rounded-2xl outline-none border transition-all focus:ring-2 focus:ring-vin-gold ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`} placeholder="khachhang@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Số điện thoại</label>
                        <input type="tel" className={`w-full px-5 py-4 rounded-2xl outline-none border transition-all focus:ring-2 focus:ring-vin-gold ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`} placeholder="090x xxx xxx" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ngày tháng năm sinh</label>
                        <input type="date" className={`w-full px-5 py-4 rounded-2xl outline-none border transition-all focus:ring-2 focus:ring-vin-gold ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`} />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Địa chỉ thường trú</label>
                        <input type="text" className={`w-full px-5 py-4 rounded-2xl outline-none border transition-all focus:ring-2 focus:ring-vin-gold ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`} placeholder="Nhập địa chỉ nhà của bạn..." />
                      </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button className="bg-vin-navy text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-vin-navy/20 active:scale-95 transition-all">
                        Lưu thông tin
                      </button>
                      <button className={`px-10 py-4 rounded-2xl font-bold transition-all ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                        Hủy bỏ
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Interface Tab */}
                {settingsTab === 'interface' && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key="interface" className="space-y-8">
                    <h3 className="text-2xl font-extrabold">Cài đặt giao diện</h3>
                    <div className={`p-6 rounded-3xl flex items-center justify-between ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                      <div>
                        <div className="font-bold">Chế độ tối</div>
                        <div className="text-sm text-gray-500">Điều chỉnh màu sắc cho môi trường thiếu sáng</div>
                      </div>
                      <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-16 h-8 rounded-full relative transition-colors ${darkMode ? 'bg-vin-gold' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${darkMode ? 'left-9' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* History & Empty State Mocks */}
                {(['history', 'favorites', 'purchases'].includes(settingsTab)) && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 text-center">
                    <div className={`p-8 rounded-full mb-6 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                      {settingsTab === 'history' ? <History size={48} className="text-gray-400" /> : settingsTab === 'favorites' ? <Heart size={48} className="text-gray-400" /> : <ShoppingBag size={48} className="text-gray-400" />}
                    </div>
                    <h4 className="font-bold text-xl mb-2">Chưa có dữ liệu</h4>
                    <p className="text-gray-500">Mọi hoạt động của bạn sẽ được hiển thị tại đây</p>
                  </motion.div>
                )}

                {/* Admin Tab */}
                {settingsTab === 'admin' && (
                  <div className="space-y-12">
                    {!isLoggedIn ? (
                      <div className="max-w-md mx-auto py-12">
                         <h3 className="text-2xl font-extrabold mb-8 text-center">Xác thực quyền quản trị</h3>
                         <form onSubmit={handleLogin} className="space-y-6">
                            <input type="email" placeholder="admin@vinhomes.vn" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={`w-full px-5 py-4 rounded-2xl outline-none border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`} />
                            <input type="password" placeholder="Mật khẩu" value={loginPass} onChange={e => setLoginPass(e.target.value)} className={`w-full px-5 py-4 rounded-2xl outline-none border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`} />
                            <button className="w-full bg-vin-navy text-white py-4 rounded-2xl font-bold">Xác nhận</button>
                         </form>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                        {/* Global System Settings */}
                        <section className="space-y-6">
                          <h3 className="text-2xl font-extrabold flex items-center gap-3">
                            <SettingsIcon className="text-vin-gold" /> Cài đặt hệ thống
                          </h3>
                          <div className={`p-8 rounded-3xl space-y-6 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500">Số điện thoại liên hệ</label>
                                <input type="text" value={siteSettings.contactPhone} onChange={e => setSiteSettings({...siteSettings, contactPhone: e.target.value})} className={`w-full px-5 py-3 rounded-xl bg-white border ${darkMode ? 'bg-slate-900 border-slate-700' : 'border-gray-200'}`} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500">Số điện thoại tư vấn</label>
                                <input type="text" value={siteSettings.consultantPhone} onChange={e => setSiteSettings({...siteSettings, consultantPhone: e.target.value})} className={`w-full px-5 py-3 rounded-xl bg-white border ${darkMode ? 'bg-slate-900 border-slate-700' : 'border-gray-200'}`} />
                              </div>
                            </div>
                            <button onClick={handleUpdateSettings} className="bg-vin-gold text-white px-8 py-3 rounded-xl font-bold">Lưu thay đổi</button>
                          </div>
                        </section>

                        {/* Add Project */}
                        <section className="space-y-6">
                          <h3 className="text-2xl font-extrabold flex items-center gap-3">
                            <PlusCircle className="text-vin-gold" /> Thêm dự án/Bất động sản
                          </h3>
                          <form onSubmit={handleCreateProject} className={`p-8 rounded-3xl space-y-6 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <input type="text" placeholder="Tên dự án" required className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200" onChange={e => setNewProject({...newProject, title: e.target.value})} />
                              <input type="text" placeholder="URL hình ảnh" required className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200" onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} />
                              <input type="number" step="0.1" placeholder="Giá (Tỷ)" required className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200" onChange={e => setNewProject({...newProject, price: parseFloat(e.target.value)})} />
                              <input type="text" placeholder="Vị trí" className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200" onChange={e => setNewProject({...newProject, location: e.target.value})} />
                            </div>
                            <textarea placeholder="Mô tả" className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 h-32" onChange={e => setNewProject({...newProject, description: e.target.value})} />
                            <button type="submit" className="bg-vin-navy text-white px-12 py-4 rounded-2xl font-bold shadow-lg shadow-vin-navy/20">Xuất bản dự án</button>
                          </form>
                        </section>
                      </motion.div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </main>
          </motion.div>
        ) : (
          <motion.div key="public" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Promo Project Highlights */}
            {promotions.length > 0 && (
              <section className="container mx-auto px-6 py-12">
                 <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3">
                  <Star className="text-vin-gold fill-vin-gold" /> Dự án ưu đãi đặc biệt
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {promotions.map(promo => (
                      <motion.div 
                        key={promo.id}
                        whileHover={{ y: -5 }}
                        onClick={() => setActivePromo(promo)}
                        className={`group relative overflow-hidden rounded-[32px] cursor-pointer h-80 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-100 shadow-sm'}`}
                      >
                        <img src={promo.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                           <div className="inline-block bg-vin-gold text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-full mb-4 w-fit tracking-widest">FLASH SALE</div>
                           <h3 className="text-3xl font-extrabold text-white mb-2">{promo.title}</h3>
                           <p className="text-gray-300 text-sm font-medium flex items-center gap-2">Nhấn để xem chương trình cụ thể <ChevronRight size={16} /></p>
                        </div>
                      </motion.div>
                    ))}
                 </div>
              </section>
            )}

            {/* Standard Listings */}
            <section className="container mx-auto px-6 py-20 bg-transparent">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h2 className="text-4xl font-extrabold mb-4">Giao dịch thịnh vượng</h2>
                  <p className={`text-lg font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Hệ sinh thái Vinhomes chính chủ, pháp lý minh bạch.</p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
                  <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
                  <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {projects.map((p, idx) => (
                    <motion.div 
                      key={p.id}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className={`group rounded-[40px] overflow-hidden border transition-all duration-500 h-full flex flex-col ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 hover:shadow-2xl shadow-sm'}`}
                    >
                      <div className="relative h-72 shrink-0 overflow-hidden">
                        <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-6 left-6 flex gap-2">
                           <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black uppercase text-vin-navy shadow-sm">{p.status}</div>
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="text-3xl font-black mb-1">{p.price} <small className="text-lg text-gray-500 font-bold tracking-tight">TỶ</small></div>
                        <h3 className="text-xl font-bold mb-4 line-clamp-1">{p.title}</h3>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                          <MapPin size={16} /> {p.location}
                        </div>
                        <div className={`mt-auto pt-6 border-t flex justify-between text-gray-500 text-sm font-bold ${darkMode ? 'border-slate-800' : 'border-gray-50'}`}>
                           <div className="flex items-center gap-2"><Bed size={16} /> {p.beds} PN</div>
                           <div className="flex items-center gap-2"><Bath size={16} /> {p.baths} PT</div>
                           <div className="flex items-center gap-2"><Maximize2 size={16} /> {p.area} m²</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promotion Detail Modal */}
      <AnimatePresence>
        {activePromo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-2xl rounded-[40px] overflow-hidden relative ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}
            >
              <button 
                onClick={() => setActivePromo(null)}
                className="absolute top-6 right-6 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all"
              >
                <LogOut size={20} className="rotate-90" />
              </button>
              <img src={activePromo.image} className="w-full h-64 object-cover" />
              <div className="p-10 text-center">
                <div className="text-vin-gold font-black uppercase text-xs tracking-[0.2em] mb-4">CHƯƠNG TRÌNH ƯU ĐÃI</div>
                <h3 className="text-3xl font-black mb-6">{activePromo.title}</h3>
                <div className={`text-lg leading-relaxed mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {activePromo.detail}
                </div>
                <button 
                  onClick={() => {
                    setView('public');
                    setActivePromo(null);
                    window.location.href = `tel:${siteSettings.consultantPhone}`;
                  }}
                  className="bg-vin-navy text-white px-10 py-5 rounded-3xl font-black text-lg shadow-2xl shadow-vin-navy/30 hover:scale-105 active:scale-95 transition-all w-full flex items-center justify-center gap-4"
                >
                  <Phone /> GỌI TƯ VẤN NGAY: {siteSettings.consultantPhone}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
