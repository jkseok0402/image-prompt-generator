import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

interface OptionProps {
  $isSelected?: boolean;
}

interface StyledCheckboxProps {
  $checked?: boolean;
}

interface CopyButtonProps {
  $visible?: boolean;
}

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  * {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
  }

  button {
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  gap: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #1a73e8;
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 48px;
  margin-bottom: 8px;
  align-items: flex-start;
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const InputSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const ResultSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #5f6368;
  font-size: 0.95rem;
  font-weight: 500;
  height: 20px;
  line-height: 20px;
  letter-spacing: -0.2px;
`;

const PromptInput = styled.textarea`
  width: 100%;
  height: 60px;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: none;
  font-size: 0.9rem;
  line-height: 1.5;
  transition: border-color 0.2s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
  }
`;

const Result = styled.div`
  background-color: white;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  height: 120px;
  overflow-y: auto;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #3c4043;
  word-break: break-all;
  white-space: pre-wrap;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 4px 0;
  position: relative;
  z-index: 1;
  padding: 4px;
`;

const GenerateButton = styled.button`
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  background-color: #1a73e8;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(26, 115, 232, 0.2);

  &:hover {
    background-color: #1557b0;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(26, 115, 232, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(26, 115, 232, 0.2);
  }
`;

const SaveButton = styled(GenerateButton)`
  background-color: #34a853;
  box-shadow: 0 2px 4px rgba(52, 168, 83, 0.2);

  &:hover {
    background-color: #2d8746;
    box-shadow: 0 4px 8px rgba(52, 168, 83, 0.3);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(52, 168, 83, 0.2);
  }
`;

const CopyButton = styled.button`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: #34a853;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2d8746;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 4px;
  max-height: calc(100vh - 280px);
  overflow-y: auto;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Category = styled.div`
  border: 1px solid #e0e0e0;
  padding: 8px;
  border-radius: 8px;
  background-color: white;
  display: flex;
  flex-direction: column;
  height: fit-content;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const CategoryTitle = styled.h3`
  margin: 0 0 6px 0;
  color: #1a73e8;
  font-size: 0.85rem;
  font-weight: 500;
  padding-bottom: 6px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: -0.2px;
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: #5f6368;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  opacity: 0.8;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f3f4;
    opacity: 1;
  }

  &:active {
    background-color: #e8eaed;
  }
`;

const GlobalResetButton = styled(ResetButton)`
  color: #d93025;
  border: 1px solid #d93025;
  padding: 6px 12px;
  font-size: 0.8rem;
  opacity: 1;

  &:hover {
    background-color: #fce8e6;
    color: #d93025;
  }
`;

const OptionContainer = styled.div`
  max-height: 110px;
  overflow-y: auto;
  padding-right: 6px;
  margin-top: 2px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f3f4;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #dadce0;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #bdc1c6;
  }
`;

const Option = styled.div<OptionProps>`
  margin: 2px 0;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: ${props => props.$isSelected ? '#e8f0fe' : 'transparent'};
  color: ${props => props.$isSelected ? '#1a73e8' : '#3c4043'};
  letter-spacing: -0.2px;
  font-weight: ${props => props.$isSelected ? '500' : '400'};
  
  &:hover {
    background-color: ${props => props.$isSelected ? '#d2e3fc' : '#f1f3f4'};
    transform: translateX(2px);
  }
`;

const Checkbox = styled.input<StyledCheckboxProps>`
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid ${props => props.$checked ? '#1a73e8' : '#dadce0'};
  appearance: none;
  background-color: ${props => props.$checked ? '#1a73e8' : 'white'};
  position: relative;
  transition: all 0.2s ease;
  
  &:checked::after {
    content: '✓';
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 10px;
  }

  &:hover {
    border-color: ${props => props.$checked ? '#1557b0' : '#80868b'};
  }
`;

const SavedPromptsContainer = styled.div`
  margin-top: 12px;
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
`;

const SavedPromptsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
  margin-top: 12px;
  max-height: 120px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f3f4;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #dadce0;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #bdc1c6;
  }
`;

const SavedPromptItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const SavedPromptText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #3c4043;
  word-break: break-all;
  line-height: 1.5;
`;

const SavedPromptActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const SmallButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  color: white;
  background-color: ${props => props.color || '#5f6368'};
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const SmallCopyButton = styled(CopyButton)`
  padding: 4px 8px;
  font-size: 0.75rem;
`;

interface SavedPrompt {
  id: string;
  korean: string;
  english: string;
  timestamp: number;
}

const categories = {
  '인물/대상': {
    '사람': 'person',
    '여성': 'woman',
    '남성': 'man',
    '어린이': 'child',
    '노인': 'elderly person',
    '부부': 'couple',
    '가족': 'family',
    '아기': 'baby',
    '동물': 'animal',
    '자연': 'nature',
    '도시': 'city',
    '풍경': 'landscape',
    '건물': 'building',
    '제품': 'product',
    '음식': 'food',
    '꽃': 'flower',
    '식물': 'plant'
  },
  '구도': {
    '고각 샷': 'high angle shot',
    '항공뷰': 'aerial view',
    '광각': 'wide angle',
    '전신 촬영': 'full body shot',
    '발바닥에서 위를 보고있는': 'foot on the pavement',
    '조감도': 'birds eye view',
    '로우 앵글 샷': 'low angle shot',
    '극저각 샷': 'extreme low angle shot',
    '눈높이 샷': 'eye level shot',
    '디테일샷': 'detail shot',
    '틸트 샷': 'tilted shot',
    '초근접 샷': 'extreme close up shot',
    '사선 샷': 'diagonal shot',
    '중앙외 근접': 'off-center close up',
    '투샷': 'two shot',
    '사이드 앵글 샷': 'side angle shot',
    '뒤에서 찍은': 'shot from behind',
    '실루엣 샷': 'Silhouette Shot',
    '더치 앵글 샷': 'Dutch Angle Shot',
    '드론 샷': 'Drone Shot',
    '자연스러운 샷': 'Candid Shot'
  },
  '색상': {
    '호박색': 'amber color',
    '아쿠아': 'aqua color',
    '아쿠아마린': 'aquamarine color',
    '버건디': 'burgundy color',
    '진홍색': 'crimson color',
    '흑단색': 'ebony color',
    '에메랄드': 'emerald color',
    '자홍색': 'fuchsia color',
    '초콜릿색': 'chocolate color',
    '황금색': 'golden color',
    '인디고': 'indigo color',
    '아이보리': 'ivory color',
    '이끼색': 'moss color',
    '장미색': 'rose color',
    '연어색': 'salmon color',
    '사파이어': 'sapphire color',
    '석판색': 'slate color',
    '황갈색': 'tan color',
    '귤색': 'tangerine color',
    '보라색': 'violet color',
    '흑백': 'black and White'
  },
  '매체': {
    '사진': 'photo of',
    '필름 스틸': 'film still of',
    '오래된 폴라로이드': 'Expired Polaroid of',
    '포토그래피': 'Photography',
    '사진 초상화': 'Photographic Portrait',
    '제품 사진': 'Product Photography',
    '일러스트': 'illustration of',
    '벡터 일러스트': 'Vector Illustration',
    '생물학 일러스트': 'Biological lllustration',
    '전문가 그래픽': 'Expert Graphic Design',
    '벡터 스티커': 'Vector Sticker Design',
    '포스터': 'Poster Design',
    '명함': 'Business Card Design',
    '빌보드': 'Billboard Design',
    '청사진': 'Blueprint',
    '스케치': 'sketch of',
    '기술 도면': 'Technical Drawing of',
    '연필 드로잉': 'Pencil Drawing',
    '2D 게임 아트': '2D game art of',
    '3D 애니메이션': '3D Animation',
    '클레이 애니메이션': 'Clay Animation',
    '유화': 'oil Painting',
    '수채화': 'Watercolor Painting',
    '아크릴화': 'Acrylic Painting',
    '에어로졸': 'Aerosol Painting',
    '에어브러시': 'Airbrush Painting',
    '애글라이프': 'Anaglyph',
    '앤토타입': 'Anthotype Print',
    '쿼틴트': 'Aquatint Print',
    '베이스 릴리프': 'Bas-Relief',
    '바틱': 'Batik',
    '디오라마': 'Diorama',
    '종이 퀼링': 'Paper Quilling',
    '릴리프 카빙': 'Relief Carving',
    '목공': 'Woodworking',
    '아트워크': 'Artwork',
    '카툰/캐릭터': 'Cartoon/Caricature',
    '배경': 'Background',
    '3D 그래피티': '3D Graffiti',
    'POV 뷰': 'POV views'
  },
  '조명': {
    '자연광': 'Natural Lighting',
    '스튜디오': 'Studio Lighting',
    '소프트': 'Soft Lighting',
    '백라이트': 'Backlight',
    '하프 리어': 'Half rear Lighting',
    '장시간 노출': 'Long Exposure',
    '소프트박스': 'Softbox lighting',
    '백열등': 'Incandescent',
    '무디': 'Moody Lighting',
    '시네마틱': 'Cinematic Lighting',
    '체적': 'Volumetric lighting',
    '아름다운': 'Beautiful Lighting',
    '액센트': 'Accent Lighting',
    '드라마틱': 'dramatic lighting',
    '레이저': 'laser lighting',
    '형광등': 'fluorescent lighting',
    '알록달록 광선': 'crepescular rays filtering in',
    '역광': 'contre-jour lighting'
  },
  '시간대 조명': {
    '블루 아워': 'blue hour lighting',
    '새벽': 'dawn lighting',
    '골든 아워': 'golden hour lighting',
    '일몰': 'Sunset lighting',
    '황혼': 'dusk lighting',
    '자정': 'midnight lighting'
  },
  '아트 스타일': {
    '유화': 'oil painting',
    '아크릴화': 'acrylic painting',
    '신스웨이브': 'SynthWave',
    '듀오톤': 'Duotone',
    '애니메': 'Anime',
    '픽사': 'Pixar',
    '토마스 킨드카이드': 'Thomas Kindcaid',
    '컬러 하프톤': 'color halftone',
    '판타지': 'Fantasy',
    '16비트 어드벤처': "1990's point and click 16 bit adventure game",
    '32비트 등각': '32 Bit Isometric',
    '환상적 무지개빛': 'Phantasmal Iridescent',
    '다이어그램': 'Diagrammatic Drawing',
    '수채화 스케치': 'Watercolor Sketch',
    '벡터 스티커': 'Vector Sticker Design',
    '찰리 하퍼': 'Charley Harper',
    '가는 선': 'Thin lines',
    '두꺼운 선': 'Thick lines',
    '레트로 팝아트': 'Retro Pop Art',
    '3D 렌더링': '3d render',
    '빌 시엔키에비치': 'Bill Sienkiewicz comic',
    '짐 헨슨': 'Jim Henson Style',
    'POV 시점': 'POV views',
    '미니멀': 'minimalist',
    '복고': 'vintage',
    '모던': 'modern',
    '퓨처리스틱': 'futuristic',
    '사이버펑크': 'cyberpunk',
    '스팀펑크': 'steampunk',
    '레트로': 'retro',
    '컨템포러리': 'contemporary'
  },
  '스타일라이즈': {
    '고해상도': 'Highly detailed',
    '초현실적': 'Ultra-realistic',
    '추상적': 'Abstract',
    '윔시컬': 'Whimsical',
    '드림스케이프': 'Dreamscape',
    '판타지': 'Fantasy',
    'CGI': 'CGI/VFX/SFX',
    '심도': 'Depth of Field',
    '보케': 'Bokeh Background',
    '로고': 'Logo Design',
    '시네마틱': 'Cinematic',
    '우아한': 'Elegant',
    '장식적': 'Ornate',
    '미래적': 'Future tech',
    '완벽한': 'Extremely Well Made',
    '의인화': 'Anthropomorphic',
    '미니멀': 'Superb Minimalism',
    '광활한': 'Expansive',
    '파스텔': 'Pastel Colors',
    '다이나믹': 'Dynamic',
    '반사광': 'Lumen reflections'
  },
  '분위기': {
    '낭만적': 'romantic',
    '신비로운': 'mysterious',
    '우울한': 'melancholic',
    '활기찬': 'energetic',
    '평화로운': 'peaceful',
    '드라마틱': 'dramatic',
    '유머러스': 'humorous',
    '서정적': 'lyrical'
  },
  '품질': {
    '수상작': 'Award-winning',
    '전문적인': 'Professional',
    '전문가급': 'Expert',
    '초세부적': 'ultra detailed',
    '사실적': 'realistic style',
    '풍부한 디테일': 'Extremely rich details',
    '포토리얼리스틱': 'photorealistic',
    '3D 렌더링': '3D render',
    '초고화질': 'Ultra high definition',
    '영화적': 'cinematic',
    '아트스테이션': 'trending on artstation',
    '명작': 'masterpiece',
    '극세사': 'hyper detail',
    '고해상도': 'HDR',
    '4K': '4k resolution',
    '8K': '8k resolution',
    '32K': '32k resolution',
    '64K': '64k resolution'
  },
  '효과': {
    '엉킨': 'entangle',
    '소용돌이': 'swirling vortex',
    '깊은 시선': 'profound gaze',
    '신비로운': 'mystica',
    '영적인': 'spiritual',
    '명상적인': 'meditative',
    '혼돈의': 'chaos',
    '우주적': 'universe',
    '점성술적': 'astrology',
    '환상적': 'fantastic',
    '트리피': 'trippy',
    '별들의': 'stars',
    '행성들의': 'planets'
  },
  '카메라/렌즈 효과': {
    '광각 렌즈': 'wide-angle lens',
    '어안 렌즈': 'fisheye lens',
    '망원 렌즈': 'telephoto lens',
    '매크로 렌즈': 'macro lens',
    '틸트 시프트': 'tilt-shift',
    '소프트 포커스': 'soft focus',
    '얕은 피사계 심도': 'shallow depth of field',
    '깊은 피사계 심도': 'deep depth of field',
    '필름 그레인': 'film grain',
    '모션 블러': 'motion blur',
    '나이트 비전': 'night vision',
    '열화상': 'thermal imaging',
    '적외선': 'infrared',
    '파노라마': 'panoramic view',
    '360도 뷰': '360-degree view',
    'VR 뷰': 'VR view'
  }
};

const translateText = async (text: string) => {
  const apiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
  
  if (!apiKey) {
    console.error('Google Translate API key is not set');
    return text;
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'ko',
          target: 'en',
          format: 'text'
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data.translations || !data.data.translations[0]) {
      throw new Error('Invalid translation response');
    }

    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

function App() {
  const [prompt, setPrompt] = useState('');
  const [translatedPrompt, setTranslatedPrompt] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState('');
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  useEffect(() => {
    // 저장된 프롬프트 불러오기
    const saved = localStorage.getItem('savedPrompts');
    if (saved) {
      // 타임스탬프 기준 내림차순 정렬 (최신순)
      const parsedPrompts = JSON.parse(saved);
      setSavedPrompts(parsedPrompts.sort((a: SavedPrompt, b: SavedPrompt) => b.timestamp - a.timestamp));
    }
  }, []);

  const savePrompt = () => {
    if (!prompt || !result) return;

    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      korean: prompt,
      english: result,
      timestamp: Date.now()
    };

    // 새 프롬프트를 배열 맨 앞에 추가
    const updatedPrompts = [newPrompt, ...savedPrompts];
    setSavedPrompts(updatedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedPrompts));
  };

  const deletePrompt = (id: string) => {
    const updatedPrompts = savedPrompts.filter(p => p.id !== id);
    setSavedPrompts(updatedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedPrompts));
  };

  const loadPrompt = (savedPrompt: SavedPrompt) => {
    setPrompt(savedPrompt.korean);
    setResult(savedPrompt.english);
  };

  useEffect(() => {
    const translatePrompt = async () => {
      if (prompt.trim()) {
        const translation = await translateText(prompt);
        setTranslatedPrompt(translation);
      } else {
        setTranslatedPrompt('');
      }
    };

    const timer = setTimeout(() => {
      translatePrompt();
    }, 500); // 0.5초 디바운스

    return () => clearTimeout(timer);
  }, [prompt]);

  const handleOptionChange = (category: string, option: string) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev };
      if (!newOptions[category]) {
        newOptions[category] = [];
      }
      if (newOptions[category].includes(option)) {
        newOptions[category] = newOptions[category].filter(o => o !== option);
      } else {
        newOptions[category].push(option);
      }
      return newOptions;
    });
  };

  const generatePrompt = () => {
    // 초기 번역된 사용자 프롬프트
    let finalPrompt = translatedPrompt;
    
    // 카테고리별 선택된 옵션
    const selectedCategoryOptions: Record<string, string[]> = {};
    
    // 카테고리별로 선택된 옵션 모으기
    Object.entries(selectedOptions).forEach(([category, options]) => {
      if (options.length > 0) {
        const translatedOptions = options.map(
          option => categories[category as keyof typeof categories][option as keyof typeof categories[keyof typeof categories]]
        );
        selectedCategoryOptions[category] = translatedOptions;
      }
    });
    
    // 구조화된 템플릿 적용
    let structuredPrompt = "";
    
    // 줄바꿈으로 원본 번역문과 구조화된 부분 분리
    if (Object.keys(selectedCategoryOptions).length > 0) {
      structuredPrompt += "\n\n";
      
      // 주제와 구도
      const subject = selectedCategoryOptions['인물/대상'] || [];
      const composition = selectedCategoryOptions['구도'] || [];
      if (subject.length > 0 || composition.length > 0) {
        structuredPrompt += "A " + 
          (subject.length > 0 ? subject.join(", ") : "") + 
          (composition.length > 0 ? " in a " + composition.join(", ") : "") + 
          ",\n";
      }
      
      // 스타일과 매체
      const artStyle = selectedCategoryOptions['아트 스타일'] || [];
      const medium = selectedCategoryOptions['매체'] || [];
      const stylize = selectedCategoryOptions['스타일라이즈'] || [];
      if (artStyle.length > 0 || medium.length > 0 || stylize.length > 0) {
        structuredPrompt += 
          (stylize.length > 0 ? "with " + stylize.join(", ") + " style" : "") +
          (artStyle.length > 0 ? (stylize.length > 0 ? ", " : "") + "drawn in " + artStyle.join(", ") : "") + 
          (medium.length > 0 ? (artStyle.length > 0 || stylize.length > 0 ? " with " : "with ") + medium.join(", ") : "") + 
          ",\n";
      }
      
      // 배경, 조명, 색상
      const background = selectedCategoryOptions['배경'] || [];
      const lighting = [...(selectedCategoryOptions['조명'] || []), ...(selectedCategoryOptions['시간대 조명'] || [])];
      const colors = selectedCategoryOptions['색상'] || [];
      const mood = selectedCategoryOptions['분위기'] || [];
      
      if (background.length > 0 || lighting.length > 0 || colors.length > 0 || mood.length > 0) {
        structuredPrompt += "set in " + 
          (background.length > 0 ? "a " + background.join(", ") + " background" : "a scene") + 
          (lighting.length > 0 ? " with " + lighting.join(", ") : "") + 
          (colors.length > 0 ? (lighting.length > 0 ? " and " : " with ") + colors.join(", ") + " tones" : "") +
          (mood.length > 0 ? (colors.length > 0 || lighting.length > 0 ? ", " : " with ") + "creating a " + mood.join(", ") + " mood" : "") +
          ",\n";
      }
      
      // 카메라 설정 및 품질
      const camera = selectedCategoryOptions['카메라/렌즈 효과'] || [];
      const quality = selectedCategoryOptions['품질'] || [];
      
      if (camera.length > 0 || quality.length > 0) {
        structuredPrompt += 
          (camera.length > 0 ? "captured in " + camera.join(", ") : "") + 
          (quality.length > 0 ? (camera.length > 0 ? ", " : "") + "rendered in " + quality.join(", ") : "") + 
          ",\n";
      }
      
      // 효과
      const effects = selectedCategoryOptions['효과'] || [];
      
      if (effects.length > 0) {
        structuredPrompt += "with " + effects.join(", ") + " effects.";
      } else if (structuredPrompt.endsWith(",\n")) {
        // 마지막 쉼표와 줄바꿈 제거
        structuredPrompt = structuredPrompt.slice(0, -2) + ".";
      }
    }
    
    // 최종 프롬프트 설정
    finalPrompt += structuredPrompt;
    setResult(finalPrompt);
  };

  const handleResetCategory = (category: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: []
    }));
  };

  const handleResetAll = () => {
    setSelectedOptions({});
  };

  const handleSavedPromptCopy = (text: string, buttonId: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        const copyButton = document.getElementById(buttonId);
        if (copyButton) {
          const originalText = copyButton.innerText;
          copyButton.innerText = '복사됨!';
          setTimeout(() => {
            copyButton.innerText = originalText;
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <HeaderContainer>
          <Title>✨ 이미지/동영상 프롬프트 생성기</Title>
          <GlobalResetButton onClick={handleResetAll}>
            🔄 전체 초기화
          </GlobalResetButton>
        </HeaderContainer>

        <TopSection>
          <InputSection>
            <SectionTitle>✏️ 프롬프트 입력</SectionTitle>
            <PromptInput
              placeholder="기본 프롬프트를 입력하세요 (한글)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </InputSection>

          <ResultSection>
            <ResultHeader>
              <SectionTitle>🎨 생성된 프롬프트</SectionTitle>
              {result && (
                <CopyButton 
                  id="copyButton" 
                  onClick={() => handleSavedPromptCopy(result, 'copyButton')}
                >
                  📋 복사
                </CopyButton>
              )}
            </ResultHeader>
            <Result>
              {result || '선택된 옵션들이 여기에 표시됩니다.'}
            </Result>
          </ResultSection>
        </TopSection>

        <ButtonContainer>
          <GenerateButton onClick={generatePrompt}>
            ⚡ 프롬프트 생성
          </GenerateButton>
          {result && (
            <SaveButton onClick={savePrompt}>
              💾 프롬프트 저장
            </SaveButton>
          )}
        </ButtonContainer>

        <CategoryContainer>
          {Object.entries(categories).map(([category, options]) => {
            const categoryEmoji = getCategoryEmoji(category);
            return (
              <Category key={category}>
                <CategoryTitle>
                  {categoryEmoji} {category}
                  {selectedOptions[category]?.length > 0 && (
                    <ResetButton onClick={() => handleResetCategory(category)}>
                      ↺ 초기화
                    </ResetButton>
                  )}
                </CategoryTitle>
                <OptionContainer>
                  {Object.entries(options).map(([option, translation]) => (
                    <Option 
                      key={option} 
                      $isSelected={selectedOptions[category]?.includes(option) || false}
                      onClick={() => handleOptionChange(category, option)}
                    >
                      <Checkbox
                        type="checkbox"
                        $checked={selectedOptions[category]?.includes(option) || false}
                        onChange={() => {}}
                      />
                      {option}
                    </Option>
                  ))}
                </OptionContainer>
              </Category>
            );
          })}
        </CategoryContainer>

        {savedPrompts.length > 0 && (
          <SavedPromptsContainer>
            <SectionTitle>📚 저장된 프롬프트</SectionTitle>
            <SavedPromptsList>
              {savedPrompts.map(savedPrompt => (
                <SavedPromptItem key={savedPrompt.id}>
                  <SavedPromptText>{savedPrompt.english}</SavedPromptText>
                  <SavedPromptActions>
                    <SmallButton
                      color="#28a745"
                      onClick={() => loadPrompt(savedPrompt)}
                    >
                      📥 불러오기
                    </SmallButton>
                    <SmallButton
                      color="#1a73e8"
                      onClick={() => handleSavedPromptCopy(savedPrompt.english, `copy-${savedPrompt.id}`)}
                      id={`copy-${savedPrompt.id}`}
                    >
                      📋 복사
                    </SmallButton>
                    <SmallButton
                      color="#dc3545"
                      onClick={() => deletePrompt(savedPrompt.id)}
                    >
                      🗑️ 삭제
                    </SmallButton>
                  </SavedPromptActions>
                </SavedPromptItem>
              ))}
            </SavedPromptsList>
          </SavedPromptsContainer>
        )}
      </Container>
    </>
  );
}

export default App;

const getCategoryEmoji = (category: string): string => {
  const emojiMap: { [key: string]: string } = {
    '인물/대상': '👤',
    '구도': '📐',
    '색상': '🎨',
    '매체': '🖼️',
    '조명': '💡',
    '시간대 조명': '🌅',
    '아트 스타일': '🖌️',
    '분위기': '🌈',
    '품질': '⭐',
    '효과': '✨',
    '카메라/렌즈 효과': '📸'
  };
  return emojiMap[category] || '📌';
}; 