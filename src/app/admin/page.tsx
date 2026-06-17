'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { db, ResearchRequest } from '@/lib/db';
import { auth, AuthSession } from '@/lib/auth';
import { 
  Shield, LogOut, FileText, CheckCircle2, Clock, Loader2, 
  Send, Edit3, X, RefreshCw, Sparkles 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  
  // All requests
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  
  // Editor Modal states
  const [editingRequest, setEditingRequest] = useState<ResearchRequest | null>(null);
  const [reportContent, setReportContent] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Route Guard & Load Admin Data
  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      alert('관리자 권한이 필요합니다. 관리자 계정으로 로그인해 주세요.');
      router.push('/login');
      return;
    }

    setSession(currentUser);
    setAuthChecking(false);

    fetchAllRequests();
  }, [router]);

  const fetchAllRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await db.getRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests for admin:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const handleUpdateStatus = async (id: string, nextStatus: 'Pending' | 'In Progress' | 'Completed') => {
    try {
      const success = await db.updateRequestStatus(id, nextStatus);
      if (success) {
        await fetchAllRequests();
      } else {
        alert('상태 업데이트에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditor = (req: ResearchRequest) => {
    setEditingRequest(req);
    setReportContent(req.reportContent || `# ${req.topic} 리서치 결과 보고서

## 1. 개요 및 요약
- 여기에 리서치 개요를 작성해 주세요.

## 2. 타겟 독자 분석
- 독자 페르소나: ${req.targetAudience}

## 3. 크리에이터를 위한 맞춤 전략 가이드
- 여기에 핵심 전략을 서술하세요.
`);
  };

  // AI 초안 자동 작성 API 호출 핸들러
  const handleGenerateAIReport = async () => {
    if (!editingRequest) return;
    
    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: editingRequest.topic,
          targetAudience: editingRequest.targetAudience,
          specialRequests: editingRequest.specialRequests || ''
        })
      });

      const data = await res.json();
      if (data.success && data.reportContent) {
        setReportContent(data.reportContent);
        if (data.isMock) {
          alert('가상 AI 모드로 보고서 초안이 생성되었습니다! (.env.local에 API Key를 넣으면 실제 ChatGPT 리포트가 작동합니다.)');
        } else {
          alert('OpenAI ChatGPT가 작성한 맞춤 보고서 초안이 로드되었습니다!');
        }
      } else {
        alert(data.error || 'AI 보고서 생성 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('AI 서버 통신 에러가 발생했습니다.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handlePublishReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;
    if (!reportContent.trim()) {
      alert('보고서 내용을 입력해 주세요.');
      return;
    }

    setPublishing(true);
    try {
      const success = await db.fulfillRequest(editingRequest.id, reportContent);
      if (success) {
        setEditingRequest(null);
        setReportContent('');
        await fetchAllRequests();
        alert('성공적으로 보고서가 발행되었습니다. 사용자 대시보드에 즉시 노출됩니다!');
      } else {
        alert('보고서 발행에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    } finally {
      setPublishing(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#060a13] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-slate-500 font-medium">관리자 세션을 조율하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#0b1329] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
              V
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-200 flex items-center gap-2">
              <span>VibeResearch Admin</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-extrabold uppercase tracking-wider border border-amber-900/35">
                Wizard of Oz Mode
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 h-9 flex items-center border border-slate-800 rounded-lg transition-colors"
            >
              사용자 모드 체험
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:opacity-85"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-6 py-10 space-y-8 flex-1">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b1329] border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">총 요청 건수</span>
            <span className="text-2xl font-extrabold">{requests.length}건</span>
          </div>
          <div className="bg-[#0b1329] border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-amber-500 uppercase block mb-1">대기중 (Pending)</span>
            <span className="text-2xl font-extrabold text-amber-500">
              {requests.filter(r => r.status === 'Pending').length}건
            </span>
          </div>
          <div className="bg-[#0b1329] border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-blue-500 uppercase block mb-1">진행중 (In Progress)</span>
            <span className="text-2xl font-extrabold text-blue-500">
              {requests.filter(r => r.status === 'In Progress').length}건
            </span>
          </div>
          <div className="bg-[#0b1329] border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-500 uppercase block mb-1">완료 (Completed)</span>
            <span className="text-2xl font-extrabold text-emerald-500">
              {requests.filter(r => r.status === 'Completed').length}건
            </span>
          </div>
        </div>

        {/* Requests Management Table */}
        <section className="bg-[#0b1329] border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-55 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>크리에이터 리서치 요청 통합 관리 목록</span>
            </h2>
            <button
              onClick={fetchAllRequests}
              className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center hover:bg-slate-900"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-505" />
            </button>
          </div>

          {loadingRequests ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">요청 데이터를 연동하고 있습니다...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              현재 제출된 유저 리서치 요청 건이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800">
                    <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider">요청일 / 이메일</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider">요청 리서치 주제</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider">현재 상태</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 tracking-wider text-right">작업 관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <div className="text-[10px] font-mono text-slate-500">
                          {new Date(req.createdAt).toLocaleDateString('ko-KR', {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="text-xs font-semibold text-slate-400 break-all mt-1">{req.userEmail}</div>
                      </td>
                      <td className="p-4 max-w-sm">
                        <div className="text-xs font-bold text-slate-200 line-clamp-1">{req.topic}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">타겟 독자: {req.targetAudience}</div>
                        {req.specialRequests && (
                          <div className="text-[10px] text-primary italic line-clamp-1 mt-0.5">요구: {req.specialRequests}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {req.status === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-900/40">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>완료</span>
                          </span>
                        ) : req.status === 'In Progress' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-400 border border-blue-900/40">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>진행중</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-900/40">
                            <Clock className="w-3 h-3" />
                            <span>대기중</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-y-1">
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1.5">
                          {req.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'In Progress')}
                              className="text-[9px] font-extrabold bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded transition-colors"
                            >
                              진행중 변경
                            </button>
                          )}
                          <button
                            onClick={() => openEditor(req)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary border border-primary/20 hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{req.status === 'Completed' ? '보고서 수정' : '보고서 작성'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* Report Editor Modal */}
      <AnimatePresence>
        {editingRequest && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-[#0b1329] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-0.5">Wizard of Oz Fulfillment</span>
                  <h3 className="text-sm font-bold text-slate-100">보고서 작성 및 크리에이터 전송</h3>
                </div>
                <button
                  onClick={() => setEditingRequest(null)}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handlePublishReport} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  
                  {/* Reference Box */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2.5 text-xs text-slate-400">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">크리에이터 요청 사항 참고용</span>
                    <div>
                      <span className="font-bold text-slate-350 block">1. 리서치 주제</span>
                      <span>{editingRequest.topic}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-slate-800">
                      <div>
                        <span className="font-bold text-slate-350 block">2. 타겟 독자 페르소나</span>
                        <span>{editingRequest.targetAudience}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-350 block">3. 작성자 이메일</span>
                        <span>{editingRequest.userEmail}</span>
                      </div>
                    </div>
                    {editingRequest.specialRequests && (
                      <div className="pt-1.5 border-t border-slate-800">
                        <span className="font-bold text-slate-350 block">4. 세부 특별 요청사항</span>
                        <span className="italic text-primary">{editingRequest.specialRequests}</span>
                      </div>
                    )}
                  </div>

                  {/* Editor Header with AI Button */}
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      보고서 본문 내용 (Markdown 포맷)
                    </label>
                    
                    <button
                      type="button"
                      disabled={aiGenerating}
                      onClick={handleGenerateAIReport}
                      className="inline-flex items-center gap-1.5 text-[10px] font-extrabold bg-gradient-to-r from-primary to-purple-600 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg shadow-md hover:shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {aiGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>AI가 리서칭 분석 중...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          <span>🤖 AI 초안 작성하기</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Textarea */}
                  <div className="space-y-2 flex-1 flex flex-col min-h-[300px]">
                    <textarea
                      required
                      value={reportContent}
                      onChange={(e) => setReportContent(e.target.value)}
                      rows={12}
                      className="w-full flex-1 p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-primary transition-colors font-mono text-slate-100 resize-y"
                      placeholder="여기에 마크다운 문법으로 완성된 리서치를 작성해 주세요."
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-slate-800 flex justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingRequest(null)}
                    className="px-4 h-10 border border-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-900 transition-colors text-xs"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={publishing}
                    className="px-5 h-10 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-primary/95 transition-colors shadow-sm text-xs"
                  >
                    {publishing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>전송 중...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>보고서 발행 (즉시 업데이트)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
