'use client';

import { useState, useRef } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  Upload,
  Image,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ChevronRight,
  Info,
  ArrowUpRight,
  Wallet,
  ExternalLink,
  Tag,
  X,
} from 'lucide-react';

type DashboardTab = 'overview' | 'content' | 'members' | 'monetization' | 'settings';

// ─── Membership Growth Data ───────────────────────────────────────────────────
const growthData = [
  { label: '19 Aug', value: 420 },
  { label: '24 Aug', value: 450 },
  { label: '28 Aug', value: 480 },
  { label: '30 Aug', value: 600 },
  { label: '31 Aug', value: 850 },
  { label: '1 Sep', value: 1200 },
  { label: '2 Sep', value: 1800 },
  { label: '5 Sep', value: 1350 },
];

const MAX_VAL = 2000;

function MembershipChart() {
  const [hovered, setHovered] = useState<number | null>(6); // default highlight index 6 (1.8K)
  const W = 560;
  const H = 220;
  const PAD_L = 40;
  const PAD_R = 16;
  const PAD_T = 20;
  const PAD_B = 36;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const pts = growthData.map((d, i) => ({
    x: PAD_L + (i / (growthData.length - 1)) * chartW,
    y: PAD_T + chartH - (d.value / MAX_VAL) * chartH,
    ...d,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H - PAD_B} L ${pts[0].x} ${H - PAD_B} Z`;

  const yLabels = [0, 500, 1000, 1500, 2000];

  return (
    <div className='w-full overflow-x-auto'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full'
        style={{ minWidth: 320 }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id='areaGrad' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#FFC533' stopOpacity='0.35' />
            <stop offset='100%' stopColor='#FFC533' stopOpacity='0.03' />
          </linearGradient>
          {pts.map((_, i) => (
            <clipPath key={i} id={`clip-${i}`}>
              <rect x={pts[0].x} y={PAD_T} width={pts[i].x - pts[0].x} height={chartH} />
            </clipPath>
          ))}
        </defs>

        {/* Horizontal grid lines */}
        {yLabels.map((v) => {
          const y = PAD_T + chartH - (v / MAX_VAL) * chartH;
          return (
            <g key={v}>
              <line
                x1={PAD_L}
                y1={y}
                x2={W - PAD_R}
                y2={y}
                stroke='#333'
                strokeWidth='1'
                strokeDasharray='4 4'
              />
              <text x={PAD_L - 6} y={y + 4} fill='#777' fontSize='9' textAnchor='end'>
                {v === 0 ? '0' : v >= 1000 ? `${v / 1000}K` : v}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill='url(#areaGrad)' />

        {/* Line */}
        <path d={linePath} fill='none' stroke='#FFC533' strokeWidth='2.5' strokeLinejoin='round' strokeLinecap='round' />

        {/* Hover vertical line */}
        {hovered !== null && (
          <line
            x1={pts[hovered].x}
            y1={PAD_T}
            x2={pts[hovered].x}
            y2={H - PAD_B}
            stroke='#FFC533'
            strokeWidth='1'
            strokeDasharray='4 3'
            opacity='0.6'
          />
        )}

        {/* Data points + hover areas */}
        {pts.map((p, i) => (
          <g key={i} onMouseEnter={() => setHovered(i)} style={{ cursor: 'pointer' }}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 5 : 3.5}
              fill={hovered === i ? '#FFC533' : '#FFC533'}
              stroke='#1a1a1a'
              strokeWidth='2'
              opacity={hovered === i ? 1 : 0.7}
            />
            {/* Tooltip bubble */}
            {hovered === i && (
              <g>
                <rect
                  x={p.x - 22}
                  y={p.y - 30}
                  width={44}
                  height={22}
                  rx={6}
                  fill='#2a2a2a'
                  stroke='#444'
                  strokeWidth='1'
                />
                <text x={p.x} y={p.y - 15} fill='#FFC533' fontSize='10' textAnchor='middle' fontWeight='bold'>
                  {p.value >= 1000 ? `${(p.value / 1000).toFixed(1)}K` : p.value}
                </text>
              </g>
            )}
            {/* Invisible hover area */}
            <rect x={p.x - 16} y={PAD_T} width={32} height={chartH + PAD_B} fill='transparent' />
          </g>
        ))}

        {/* X-axis labels */}
        {pts.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={H - 6}
            fill={hovered === i ? '#FFC533' : '#555'}
            fontSize='8.5'
            textAnchor='middle'
            fontWeight={hovered === i ? 'bold' : 'normal'}
          >
            {p.label}
          </text>
        ))}

        {/* Live indicator */}
        <g>
          <circle cx={W - PAD_R - 26} cy={PAD_T + 4} r={4} fill='#4ade80' />
          <text x={W - PAD_R - 19} y={PAD_T + 8} fill='#4ade80' fontSize='9' fontWeight='600'>
            Live
          </text>
        </g>
      </svg>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  delta,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  iconBg: string;
}) {
  return (
    <div className='flex-1 min-w-[180px] bg-[#1e1e1e] border border-white/8 rounded-2xl p-5 flex flex-col gap-3'>
      <div className='flex items-center gap-2.5'>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
        <span className='text-xs text-gray-400 font-medium'>{label}</span>
      </div>
      <p className='text-3xl font-bold text-white tracking-tight'>{value}</p>
      <div className='flex items-center justify-between'>
        <span className='text-[11px] text-[#4ade80] font-semibold flex items-center gap-1'>
          <TrendingUp className='w-3 h-3' />
          {delta}
        </span>
        <button className='text-[11px] text-[#FFC533] flex items-center gap-0.5 hover:underline transition-all'>
          View details <ExternalLink className='w-3 h-3' />
        </button>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div className='space-y-8'>
      {/* Stat Cards */}
      <div className='flex flex-wrap gap-4'>
        <StatCard
          icon={<Users className='w-4 h-4 text-[#FFC533]' />}
          iconBg='bg-[#FFC533]/10'
          label='Active Members'
          value='2,148'
          delta='+8.3% this weekend'
        />
        <StatCard
          icon={<span className='text-sm font-bold text-[#FFC533]'>₦</span>}
          iconBg='bg-[#FFC533]/10'
          label='Active Paid Subscriptions'
          value='1,500'
          delta='+12% this weekend'
        />
        <StatCard
          icon={<DollarSign className='w-4 h-4 text-[#FFC533]' />}
          iconBg='bg-[#FFC533]/10'
          label='Gross Revenue'
          value='3.5m'
          delta='+12% this weekend'
        />
      </div>

      {/* Performance Section */}
      <div>
        <h2 className='text-lg font-bold text-white mb-4'>Performance</h2>
        <div className='bg-[#1e1e1e] border border-white/8 rounded-2xl p-5'>
          <div className='flex items-center gap-2 mb-4'>
            <span className='text-xs text-gray-400 font-semibold'>Membership growth</span>
            <Info className='w-3.5 h-3.5 text-gray-500 cursor-help' />
          </div>
          <MembershipChart />
        </div>
      </div>
    </div>
  );
}

// ─── Content & Feed Tab ───────────────────────────────────────────────────────
const SAMPLE_POSTS = [
  {
    id: 1,
    author: "Chef Tolu's Kitchen",
    handle: '@chef_tolu_24',
    avatar: '/images/community/avatar-1.png',
    image: '/images/community/cover-1.jpg',
    caption: "Cooking street food tonight right in my kitchen. Suya-style seasoned chicken on the grill, with the full commentary and tips for those of you who want to try this at home",
    likes: 344,
    comments: 17,
    shares: 13,
    time: '2h',
  },
  {
    id: 2,
    author: "Chef Tolu's Kitchen",
    handle: '@chef_tolu_24',
    avatar: '/images/community/avatar-1.png',
    image: '/images/community/cover-2.jpg',
    caption: "Cooking street food tonight right in my kitchen. Suya-style seasoned chicken on the grill, with the full commentary and tips for those of you who want to try this at home",
    likes: 344,
    comments: 17,
    shares: 13,
    time: '2h',
  },
];

function ContentTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['#food', '#cooking', '#greetings']);
  const [postToFeed, setPostToFeed] = useState(true);
  const [recurringContent, setRecurringContent] = useState(false);
  const [chooseRecurring, setChooseRecurring] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/\s+/g, '');
    if (t && !tags.includes(t)) {
      setTags([...tags, t.startsWith('#') ? t : `#${t}`]);
      setTagInput('');
    }
  };

  return (
    <div className='space-y-8'>
      {/* Settings row */}
      <div className='bg-[#1e1e1e] border border-white/8 rounded-2xl p-6 space-y-5'>
        <h3 className='text-sm font-bold text-white'>Post Community Content</h3>

        {[
          {
            label: 'Post Community content to my feed',
            sub: 'Allow community content to appear on your main feed.',
            state: postToFeed,
            set: setPostToFeed,
          },
          {
            label: 'Enable recurring content',
            sub: 'Automatically re-share posts on a set schedule.',
            state: recurringContent,
            set: setRecurringContent,
          },
          {
            label: 'Choose your recurring post(s)',
            sub: null,
            state: chooseRecurring,
            set: setChooseRecurring,
          },
        ].map((item) => (
          <div key={item.label} className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-sm text-white font-medium'>{item.label}</p>
              {item.sub && <p className='text-xs text-gray-500 mt-0.5'>{item.sub}</p>}
            </div>
            <button
              type='button'
              onClick={() => item.set(!item.state)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors flex-shrink-0 ${
                item.state ? 'bg-[#4ade80]' : 'bg-[#333]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  item.state ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Section */}
      <div className='bg-[#1e1e1e] border border-white/8 rounded-2xl p-6 space-y-5'>
        <h3 className='text-sm font-bold text-white'>Upload File</h3>

        {/* Drop Zone */}
        <div
          className='border-2 border-dashed border-white/15 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FFC533]/50 hover:bg-[#FFC533]/3 transition-all'
          style={{ minHeight: '160px' }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <div className='relative w-full h-40 rounded-lg overflow-hidden'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt='Preview' className='w-full h-full object-cover' />
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewUrl(null);
                  setUploadedFile(null);
                }}
                className='absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            </div>
          ) : (
            <>
              <div className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center'>
                <Upload className='w-5 h-5 text-gray-400' />
              </div>
              <div className='text-center'>
                <p className='text-xs text-gray-400 font-medium'>
                  Max 1GB, PNG, JPEG, PSD and MP4
                </p>
                <p className='text-xs text-gray-600 mt-0.5'>drag & drop or click to browse</p>
              </div>
              <button
                type='button'
                className='px-5 py-2 rounded-lg bg-[#FFC533] text-black text-xs font-semibold hover:bg-[#e6b12d] transition-colors'
              >
                + media
              </button>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*,video/*'
          className='hidden'
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {/* Caption */}
        <div>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder='Write a caption...'
            className='w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFC533]/30 resize-none transition-all'
          />
        </div>

        {/* Tags */}
        <div>
          <div className='flex items-center gap-2 flex-wrap mb-2'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='flex items-center gap-1 px-2.5 py-1 bg-[#FFC533]/10 text-[#FFC533] text-xs rounded-full font-medium border border-[#FFC533]/20'
              >
                {tag}
                <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
                  <X className='w-3 h-3' />
                </button>
              </span>
            ))}
            <div className='flex items-center gap-1'>
              <Tag className='w-3 h-3 text-gray-500' />
              <input
                type='text'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder='Add tag...'
                className='bg-transparent text-xs text-gray-400 placeholder:text-gray-600 focus:outline-none w-24'
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-3'>
          <button
            type='button'
            className='px-6 py-2 rounded-lg bg-[#FFC533] text-black text-xs font-bold hover:bg-[#e6b12d] transition-colors'
          >
            Save
          </button>
          <button
            type='button'
            className='px-6 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors'
          >
            Post
          </button>
          <button
            type='button'
            className='px-6 py-2 rounded-lg border border-white/15 text-white text-xs font-semibold hover:bg-white/5 transition-colors'
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Posted Content Feed */}
      <div className='space-y-4'>
        <h3 className='text-sm font-bold text-white'>Posted Content</h3>
        {SAMPLE_POSTS.map((post) => (
          <div
            key={post.id}
            className='bg-[#1e1e1e] border border-white/8 rounded-2xl overflow-hidden'
          >
            {/* Post Header */}
            <div className='flex items-center justify-between px-4 pt-4 pb-3'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full overflow-hidden bg-[#333] flex-shrink-0'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <p className='text-sm font-semibold text-white'>{post.author}</p>
                  <p className='text-xs text-gray-500'>{post.handle}</p>
                </div>
              </div>
              <button className='text-gray-500 hover:text-white transition-colors'>
                <MoreHorizontal className='w-4 h-4' />
              </button>
            </div>

            {/* Post Image */}
            <div className='w-full aspect-[16/9] bg-[#141414] overflow-hidden'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt='Post'
                className='w-full h-full object-cover'
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            {/* Caption */}
            <div className='px-4 py-3'>
              <p className='text-xs text-gray-300 leading-relaxed line-clamp-2'>{post.caption}</p>
            </div>

            {/* Engagement */}
            <div className='flex items-center gap-5 px-4 pb-4'>
              <button className='flex items-center gap-1.5 text-gray-400 hover:text-[#FFC533] transition-colors'>
                <Heart className='w-4 h-4' />
                <span className='text-xs'>{post.likes}</span>
              </button>
              <button className='flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors'>
                <MessageCircle className='w-4 h-4' />
                <span className='text-xs'>{post.comments}</span>
              </button>
              <button className='flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors'>
                <Share2 className='w-4 h-4' />
                <span className='text-xs'>{post.shares}</span>
              </button>
              <span className='ml-auto text-xs text-gray-600'>{post.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Members Tab ──────────────────────────────────────────────────────────────
const MEMBERS = [
  { name: 'Ayo Femi', username: '@ayofemi', avatar: null, activity: 'May 2%', status: 'Active', statusColor: 'text-[#4ade80]' },
  { name: 'Chidi Mark', username: '@chidimark', avatar: null, activity: 'Apr 5%', status: '#150,500', statusColor: 'text-[#FFC533]' },
  { name: 'Chiamaka', username: '@chiamaka', avatar: null, activity: 'Jan 2%', status: 'Active', statusColor: 'text-[#4ade80]' },
  { name: 'Emeka', username: '@emeka_j', avatar: null, activity: 'Mar 9%', status: 'Expiring soon', statusColor: 'text-[#fb923c]' },
  { name: 'Temitope', username: '@temitope', avatar: null, activity: 'Feb 3%', status: 'Active', statusColor: 'text-[#4ade80]' },
  { name: 'Funmilayo', username: '@funmi', avatar: null, activity: 'Jun 7%', status: 'Expiring soon', statusColor: 'text-[#fb923c]' },
];

const INITIALS_COLORS = ['#FFC533', '#4ade80', '#60a5fa', '#f87171', '#c084fc', '#fb923c'];

function MembersTab() {
  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-bold text-white'>All Members (2,135)</h3>
        <button className='text-xs text-[#FFC533] hover:underline'>Export CSV</button>
      </div>

      <div className='bg-[#1e1e1e] border border-white/8 rounded-2xl overflow-hidden'>
        {/* Table Header */}
        <div className='grid grid-cols-3 px-5 py-3 border-b border-white/8 text-xs text-gray-500 font-semibold'>
          <span>User type</span>
          <span className='text-center'>Activity</span>
          <span className='text-right'>Patronage Status</span>
        </div>
        {/* Rows */}
        {MEMBERS.map((m, i) => (
          <div
            key={m.username}
            className='grid grid-cols-3 items-center px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors'
          >
            <div className='flex items-center gap-3'>
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0'
                style={{ backgroundColor: INITIALS_COLORS[i % INITIALS_COLORS.length] }}
              >
                {m.name.charAt(0)}
              </div>
              <div>
                <p className='text-xs font-semibold text-white'>{m.name}</p>
                <p className='text-[11px] text-gray-500'>{m.username}</p>
              </div>
            </div>
            <span className='text-xs text-gray-400 text-center'>{m.activity}</span>
            <span className={`text-xs font-semibold text-right ${m.statusColor}`}>{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Monetization Tab ─────────────────────────────────────────────────────────
function MonetizationTab() {
  return (
    <div className='space-y-6'>
      <div className='bg-[#1e1e1e] border border-white/8 rounded-2xl p-8 text-center space-y-4'>
        <div className='w-12 h-12 rounded-2xl bg-[#FFC533]/10 flex items-center justify-center mx-auto'>
          <Wallet className='w-6 h-6 text-[#FFC533]' />
        </div>
        <div>
          <p className='text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1'>Earnings</p>
          <p className='text-4xl font-extrabold text-white tracking-tight'>
            ₦ 3,500,000.00
          </p>
        </div>
        <button className='px-8 py-3 rounded-xl bg-[#FFC533] text-black font-bold text-sm hover:bg-[#e6b12d] transition-colors shadow-md'>
          Withdraw funds
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {[
          { label: 'This Month', value: '₦450,000', delta: '+12%', positive: true },
          { label: 'Last Month', value: '₦398,000', delta: '-3%', positive: false },
          { label: 'Total Subscribers', value: '1,500', delta: '+8%', positive: true },
          { label: 'Avg. Revenue / Member', value: '₦2,333', delta: '+5%', positive: true },
        ].map((item) => (
          <div
            key={item.label}
            className='bg-[#1e1e1e] border border-white/8 rounded-xl p-4 flex items-center justify-between'
          >
            <div>
              <p className='text-xs text-gray-500 mb-1'>{item.label}</p>
              <p className='text-lg font-bold text-white'>{item.value}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                item.positive ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-red-500/10 text-red-400'
              }`}
            >
              {item.delta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const [communityName, setCommunityName] = useState("Chef Tolu's Kitchen");
  const [communityBio, setCommunityBio] = useState('Exclusive recipes, masterclasses, and tasting meetups.');
  const [price, setPrice] = useState('2500');
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);

  return (
    <div className='space-y-6 max-w-xl'>
      <div className='bg-[#1e1e1e] border border-white/8 rounded-2xl p-6 space-y-5'>
        <h3 className='text-sm font-bold text-white'>Community Info</h3>
        <div className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-400 mb-1.5'>Community Name</label>
            <input
              type='text'
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className='w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FFC533]/30 transition-all'
            />
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-400 mb-1.5'>Bio</label>
            <textarea
              rows={3}
              value={communityBio}
              onChange={(e) => setCommunityBio(e.target.value)}
              className='w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FFC533]/30 resize-none transition-all'
            />
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-400 mb-1.5'>Monthly Price (₦)</label>
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FFC533]/30 transition-all'
            />
          </div>
        </div>
      </div>

      <div className='bg-[#1e1e1e] border border-white/8 rounded-2xl p-6 space-y-4'>
        <h3 className='text-sm font-bold text-white'>Visibility & Interaction</h3>
        {[
          { label: 'Public community', sub: 'Anyone can discover and request to join.', state: isPublic, set: setIsPublic },
          { label: 'Allow comments', sub: 'Members can comment on posts.', state: allowComments, set: setAllowComments },
        ].map((item) => (
          <div key={item.label} className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-sm text-white font-medium'>{item.label}</p>
              <p className='text-xs text-gray-500 mt-0.5'>{item.sub}</p>
            </div>
            <button
              type='button'
              onClick={() => item.set(!item.state)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors flex-shrink-0 ${
                item.state ? 'bg-[#4ade80]' : 'bg-[#333]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  item.state ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className='flex gap-3'>
        <button className='px-6 py-2.5 rounded-xl bg-[#FFC533] text-black text-xs font-bold hover:bg-[#e6b12d] transition-colors'>
          Save changes
        </button>
        <button className='px-6 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 border border-red-500/20 transition-colors'>
          Delete community
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export function CreatorManagementDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const tabs: { id: DashboardTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content and feed management' },
    { id: 'members', label: 'Members' },
    { id: 'monetization', label: 'Monetization' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className='w-full space-y-6 animate-in fade-in duration-300'>
      {/* Header */}
      <div className='pb-4 border-b border-white/10'>
        <h1 className='text-2xl font-bold text-white'>Creator management dashboard</h1>
      </div>

      {/* Tab Nav */}
      <div className='flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#FFC533] text-black shadow-sm'
                : 'bg-[#262626] text-gray-300 hover:bg-[#333] hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='pb-10'>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'monetization' && <MonetizationTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
