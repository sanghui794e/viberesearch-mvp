'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { db, ResearchRequest } from '@/lib/db';
import { auth, AuthSession } from '@/lib/auth';
import { 
  LogOut, PlusCircle, FileText, CheckCircle2, Clock, 
  ArrowUpRight, Loader2, Sparkles, Download, X 
} from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean>(true); // 기본적으로 승인 완료 상태로 시작 후 검사
  
  // Form States
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Requests History
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Selected Report Modal
  const [selectedRequest, setSelectedRequest] = useState<ResearchRequest | null>(null);

  // Route Guard & Load Data
  useEffect(() => {
    const checkAuthAndApproveStatus = async () => {
      const currentUser = auth.getCurrentUser();
      
      if (!currentUser) {
        router.push('/login');
        return;
      }

      if (!currentUser.isSubscribed && currentUser.role !== 'admin') {
        router.push('/checkout');
        return;
      }

      // DB에서 실시간 프로필 정보를 조회하여 승인 상태 검증
      try {
        const profile = await db.getProfile(currentUser.email);
        if (profile) {
          setIsApproved(profile.isApproved);
        } else {
          // 프로필 정보가 없으면 가드 처리
          setIsApproved(false);
        }
      } catch (err) {
        console.error('Failed to load profile for approval checking:', err);
        setIsApproved(false);
      }

      setSession(currentUser);
      setAuthChecking(false);
      
      fetchHistory(currentUser.email);
    };

    checkAuthAndApproveStatus();
  }, [router]);

  const fetchHistory = async (userId: string) => {
    setLoadingHistory(true);
    try {
      const data = await db.getRequests(userId);
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch research requests:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !targetAudience) {
      alert('주제와 타겟 독자는 필수 입력 항목입니다.');
      return;
    }

    setFormSubmitting(true);
    try {
      await db.createRequest({
        userId: session?.email || 'unknown',
        userEmail: session?.email || 'unknown',
        topic,
        targetAudience,
        specialRequests,
      });

      setTopic('');
      setTargetAudience('');
      setSpecialRequests('');

      if (session) {
        await fetchHistory(session.email);
      }
      alert('리서치 요청이 등록되었습니다. 48시간 내에 완료됩니다!');
    } catch (err) {
      console.error(err);
      alert('요청 등록 중 오류가 발생했습니다.');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#060a13] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-slate-500 font-medium">인증 정보를 조회하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 승인되지 않은 일반 사용자 전용 아름다운 대기 화면
  if (!isApproved && session?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#060a13] text-slate-100 flex items-center justify-center font-sans p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#0b1329] border border-slate-800 p-8 rounded-2xl shadow-xl shadow-black/40 text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              승인 대기 중입니다 ⏳
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              안녕하세요, 크리에이터님! VibeResearch의 프라이빗 테스트에 참여해 주셔서 감사합니다.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              현재 무분별한 리서치 요청 남용을 방지하기 위해 가입 승인 대기제를 운영하고 있습니다. 운영자(지인)에게 승인을 요청해 주시면 신속히 확인하여 대시보드를 활성화해 드리겠습니다.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl text-left space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">등록 정보</span>
            <div className="text-xs font-semibold text-slate-300 break-all">{session?.email}</div>
            <div className="text-[10px] text-amber-400/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>가상 결제 완료 ➡️ 승인 대기 중</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                // 승인 상태 재확인용 새로고침
                window.location.reload();
              }}
              className="w-full h-11 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
            >
              승인 상태 확인하기
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full h-11 border border-slate-800 hover:bg-red-950/20 text-slate-400 hover:text-red-400 text-xs font-semibold rounded-xl transition-all"
            >
              다른 계정으로 로그인 (로그아웃)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-[#0b1329] flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
              V
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              VibeResearch
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">크리에이터 계정</span>
            <span className="text-xs font-semibold text-slate-300 break-all">{session?.email}</span>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>구독 멤버십 활성</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center justify-center gap-2 w-full h-10 border border-slate-800 hover:bg-red-950/20 text-slate-400 hover:text-red-400 text-xs font-medium rounded-xl transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>로그아웃</span>
        </button>
      </aside>

      {/* Main Workspace Dashboard */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Creator Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">
              리서치 요청을 남겨주시면 전담 비서가 48시간 이내에 세밀한 시장 보고서를 전달합니다.
            </p>
          </div>
        </div>

        {/* 1. Request Input Form (FBM Ability/Brain Cycles 최소화) */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0b1329] border border-slate-800 p-8 rounded-2xl shadow-sm"
        >
          <h2 className="text-sm font-bold mb-6 text-slate-50 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-primary" />
            <span>새 리서치 요청하기</span>
          </h2>
          
          <form onSubmit={handleSubmitRequest} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Research Topic */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  리서치 주제 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 20-30대 직장인 타겟 오디오 에세이 비즈니스 모델 조사"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-primary transition-colors text-slate-100"
                />
              </div>

              {/* Target Audience */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  타겟 독자 (페르소나) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 출퇴근 시간을 활용해 성장하고 싶은 직장인"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-primary transition-colors text-slate-100"
                />
              </div>
            </div>

            {/* Special Request */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                특별 요청사항 (원하는 포커스 또는 조사 방향)
              </label>
              <textarea
                placeholder="예: 해외 서브스택(Substack) 유료 뉴스레터 성공 사례를 집중 분석해 주세요."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-primary transition-colors text-slate-100 resize-y"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={formSubmitting}
                className="h-11 px-6 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-primary/95 transition-colors shadow-sm text-xs"
              >
                {formSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>전송 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>리서치 비서에게 조사 맡기기</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.section>

        {/* 2. History Table */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0b1329] border border-slate-800 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>내 리서치 요청 및 완료 리포트</span>
            </h2>
          </div>

          {loadingHistory ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-xs">이력을 불러오고 있습니다...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-1">
              <p className="text-xs font-semibold">제출된 리서치 요청이 없습니다.</p>
              <p className="text-[11px] text-slate-600">위 양식을 작성하여 첫 리서치를 요청해 보세요!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800">
                    <th className="p-4 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">요청 날짜</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">리서치 주제</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">상태</th>
                    <th className="p-4 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider text-right">결과</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 text-[10px] font-mono text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-bold text-slate-200 line-clamp-1">{req.topic}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">독자: {req.targetAudience}</div>
                      </td>
                      <td className="p-4">
                        {req.status === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-900/50">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>완료</span>
                          </span>
                        ) : req.status === 'In Progress' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-400 border border-blue-900/50">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>진행중</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-900/50">
                            <Clock className="w-3 h-3" />
                            <span>대기중</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {req.status === 'Completed' ? (
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-white hover:bg-primary px-3 h-7 rounded-lg transition-all border border-primary/20"
                          >
                            <span>결과 보기</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">준비 중</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

      </main>

      {/* 3. Framer Motion Report View Modal Popup */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-[#0b1329] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-0.5">완료된 인사이트 리포트</span>
                  <h3 className="text-base font-bold text-slate-100 line-clamp-1">{selectedRequest.topic}</h3>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
                
                {/* Topic Metadata box */}
                <div className="grid grid-cols-2 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs">
                  <div>
                    <span className="font-semibold text-slate-500 block mb-0.5">타겟 독자</span>
                    <span className="font-medium text-slate-350">{selectedRequest.targetAudience}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block mb-0.5">리서치 발행일</span>
                    <span className="font-medium text-slate-350">
                      {new Date(selectedRequest.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Report Content */}
                <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4 whitespace-pre-wrap select-text font-sans text-slate-300">
                  {selectedRequest.reportContent || '보고서 데이터를 불러올 수 없습니다.'}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 h-10 border border-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-900 transition-colors text-xs"
                >
                  닫기
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="px-5 h-10 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF 출력 / 저장</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
