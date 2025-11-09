import os
import zipfile
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
from sentence_transformers import SentenceTransformer
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
from contextlib import asynccontextmanager
import logging
import re
from typing import List, Optional

# =================================================================
# ==> THIS IS THE FIX. WE ARE IMPORTING THE CORS MIDDLEWARE
# =================================================================
from fastapi.middleware.cors import CORSMiddleware
from repair_corrector import RepairKnowledgeCorrector
# =================================================================

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- 1. SET UP A GLOBAL "STATE" TO HOLD OUR MODELS ---
models = {}

# --- ANTI-HALLUCINATION UTILITIES ---
class ResponseValidator:
    """Validates and filters AI responses to reduce hallucination"""
    
    REPAIR_KEYWORDS = [
        'repair', 'fix', 'check', 'replace', 'troubleshoot', 'diagnose',
        'connector', 'cable', 'component', 'device', 'hardware', 'software',
        'power', 'connection', 'screw', 'tool', 'safety', 'manual',
        'voltage', 'circuit', 'battery', 'wire', 'solder', 'test'
    ]
    
    # Electronics/device repair terms that shouldn't be used for other items
    ELECTRONICS_TERMS = [
        'spudger', 'phillips screwdriver', 'ph00', 'pry up', 'back cover',
        'front cover', 'bodice', 'ifix', 'opening tool', 'tweezers',
        'prying', 'circuit board', 'connector'
    ]
    
    FORBIDDEN_PHRASES = [
        'as an ai', 'i am a', 'i cannot', 'i don\'t have access',
        'i\'m not able to', 'please consult', 'it is important to note'
    ]
    
    # Comprehensive knowledge base for common repair procedures
    DEVICE_KNOWLEDGE = {
        'phone_screen_replacement': """
Phone Screen Replacement Steps:

Required Tools:
- Pentalobe/Phillips screwdrivers (device-specific)
- Plastic opening tools/spudgers
- Suction cup tool
- Heat gun or hair dryer
- Tweezers
- Adhesive strips

Steps:
1. Power off device completely and remove SIM tray
2. Remove screws at device bottom (usually 2 pentalobe screws)
3. Apply gentle heat to soften adhesive around screen edges
4. Place suction cup near bottom of screen, pull while inserting opening tool
5. Work opening tool around edges to separate adhesive
6. Lift screen carefully - cables still attached underneath
7. Remove metal shields covering connector screws
8. Disconnect screen cables using plastic spudger
9. Remove old screen completely
10. Connect new screen cables in reverse order
11. Test screen before final assembly
12. Apply new adhesive and press screen into place
13. Replace screws and SIM tray

⚠️ SAFETY: Handle screen with care - glass can shatter. Work slowly with cables.
""",
        'phone_battery_replacement': """
Phone Battery Replacement Procedure:

Required Tools:
- Device-specific screwdrivers
- Plastic opening tools
- Suction handle
- Heat gun (low setting)
- Tweezers

Steps:
1. Power off phone and remove back cover/screen to access battery
2. Disconnect battery connector first (black cable)
3. Remove any metal brackets covering battery
4. Locate battery adhesive pull tabs (usually white strips)
5. Pull adhesive tabs slowly at 45-degree angle
6. If tabs break, apply gentle heat to soften adhesive
7. Use plastic tools to carefully lift battery (never metal tools)
8. Install new battery with fresh adhesive
9. Reconnect battery connector
10. Reassemble device in reverse order

⚠️ SAFETY: Never puncture battery. Work away from heat sources. Discharge to <25% first.
""",
        'iphone_7_battery_replacement': """
iPhone 7 Battery Replacement Guide:

Required Tools:
- Pentalobe P2 screwdriver (for bottom screws)
- Phillips PH00 screwdriver
- Plastic opening picks
- Suction handle
- Spudger tool
- Tweezers

Steps:
1. Power off iPhone 7 completely
2. Remove two 3.4mm Pentalobe P2 screws at bottom of device
3. Use suction handle and opening picks to separate screen from rear case
4. Open display like a book (hinge on left side)
5. Remove four Phillips PH00 screws securing battery connector bracket
6. Remove metal battery connector bracket
7. Disconnect battery connector with spudger (lift up, not side to side)
8. Remove battery adhesive strips by pulling slowly at low angle
9. If strips break, apply heat (60°C max) to soften adhesive
10. Carefully lift battery with plastic tools only
11. Install new battery with fresh adhesive strips
12. Reconnect battery connector firmly
13. Replace metal bracket and screws
14. Close display and replace bottom screws

⚠️ SAFETY: Discharge battery below 25% first. Never puncture battery. Work in static-free environment.

Common Issues:
- Broken adhesive strips: Use heat gun at low setting
- Stubborn battery: Never use metal tools, apply gentle heat instead
- Connector damage: Ensure proper alignment before pressing down
""",
        'phone_troubleshooting': """
Phone Won't Turn On - Troubleshooting Guide:

Step 1: Check Power
- Verify charger is plugged in and working
- Try different charging cable and adapter
- Clean charging port with dry toothpick
- Check for visible damage to charging port

Step 2: Force Restart
- iPhone: Hold Power + Home buttons (older) or Power + Volume Down (newer) for 15 seconds
- Android: Hold Power button for 15-30 seconds
- Some devices: Hold Power + Volume Up + Volume Down simultaneously

Step 3: Check Battery
- If device hasn't been used for weeks, battery may be completely drained
- Leave on charger for 30-60 minutes before trying to turn on
- Look for charging indicator (LED or screen animation)

Step 4: Hardware Issues
- Remove case and check for physical damage
- Ensure no liquid damage (check liquid damage indicators)
- Try connecting to computer to see if device is recognized

⚠️ If none of these steps work, likely hardware failure requiring professional repair.
""",
        'device_water_damage': """
Water Damage Emergency Response:

IMMEDIATE STEPS (First 30 minutes):
1. Power off device immediately - DO NOT turn on if wet
2. Remove from water source quickly
3. Remove case, SIM card, SD card if possible
4. Gently shake out excess water
5. Do NOT use hair dryer or heat source

DRYING PROCESS (24-72 hours):
1. Gently pat dry with soft cloth
2. Place in container with uncooked rice or silica gel packets
3. Ensure device is completely covered
4. Leave sealed for 24-72 hours minimum
5. Place container in warm, dry location

AFTER DRYING:
1. Check for moisture in camera lens or screen
2. If completely dry, try powering on
3. Test all functions: charging, speakers, microphone, buttons
4. If any issues persist, seek professional repair immediately

⚠️ NEVER: Use heat sources, turn on while wet, or charge wet device.
Success rate decreases significantly after first few hours.
""",
        'laptop_battery_replacement': """
Laptop Battery Replacement Guide:

Required Tools:
- Phillips screwdrivers
- Plastic prying tools
- Anti-static wrist strap

Steps:
1. Shut down laptop completely and unplug power adapter
2. Remove laptop back cover screws (usually 8-12 screws)
3. Carefully remove back panel using plastic tools
4. Locate battery pack (large rectangular component)
5. Unplug battery cable connector carefully
6. Remove battery mounting screws (typically 3-4 screws)
7. Lift out old battery using plastic tabs (never metal tools)
8. Insert new battery and secure with screws
9. Reconnect battery cable firmly
10. Replace back cover and test power-on

⚠️ SAFETY: Ground yourself before touching components. Handle battery carefully.
""",
        'laptop_screen_replacement': """
Laptop Screen Replacement Guide:

Required Tools:
- Phillips screwdrivers (various sizes)
- Plastic prying tools
- Magnetic parts tray

Steps:
1. Power off laptop and remove battery if removable
2. Remove screen bezel screws (usually under rubber covers)
3. Carefully remove plastic bezel around screen
4. Unscrew screen from hinges (typically 4-6 screws)
5. Tilt screen forward to access cable connector
6. Disconnect video cable carefully
7. Remove old screen completely
8. Connect new screen cable firmly
9. Secure screen to hinges with screws
10. Replace bezel and test display
11. Reinstall battery

⚠️ SAFETY: Handle LCD/LED panel carefully - very fragile.
""",
        'general_repair_safety': """
Universal Device Repair Safety:
- Always power off device before starting
- Use proper tools for each component
- Work in good lighting on stable surface
- Keep track of screws in labeled containers
- Take photos before disassembly for reference
- Never force components - gentle pressure only
- Discharge static electricity before touching internals
- Handle batteries with extreme care
""",
        'charging_port_repair': """
Charging Port Repair Guide:

Required Tools:
- Phillips/Pentalobe screwdrivers
- Plastic prying tools
- Magnifying glass
- Fine-tip tweezers
- Soldering iron (for advanced repairs)
- Replacement charging port assembly

Steps:
1. Power off device completely and discharge battery below 25%
2. Remove device back cover or screen to access internals
3. Disconnect battery to prevent electrical damage
4. Locate charging port assembly (usually bottom of device)
5. Remove screws securing charging port bracket
6. Disconnect charging port flex cable carefully
7. Remove old charging port assembly
8. Clean debris from charging port area with compressed air
9. Install new charging port assembly
10. Reconnect flex cable firmly
11. Secure with screws and test connection
12. Reassemble device and test charging

⚠️ SAFETY: Disconnect battery first. Check for debris before replacement. Some repairs require micro-soldering skills.

Troubleshooting:
- Clean port with toothpick/compressed air first
- Check cable and charger before replacing port
- Loose connection may just need cable reseating
"""
    }
    
    @classmethod
    def get_knowledge_based_response(cls, question: str) -> tuple[str, float] | None:
        """Check if we have specific knowledge for this repair question - COMPREHENSIVE MATCHING"""
        question_lower = question.lower()
        
        # iPhone 7 specific (highest priority)
        if 'iphone 7' in question_lower or 'iphone7' in question_lower:
            if any(word in question_lower for word in ['battery', 'replace', 'fix', 'repair', 'change', 'install']):
                return cls.DEVICE_KNOWLEDGE['iphone_7_battery_replacement'], 0.98
        
        # Screen replacement queries (comprehensive matching)
        screen_terms = ['screen', 'display', 'lcd', 'digitizer', 'touch screen', 'cracked screen']
        repair_terms = ['replace', 'fix', 'repair', 'change', 'broken', 'cracked', 'shattered']
        
        if any(term in question_lower for term in screen_terms) and any(term in question_lower for term in repair_terms):
            if any(device in question_lower for device in ['phone', 'smartphone', 'iphone', 'android']):
                return cls.DEVICE_KNOWLEDGE['phone_screen_replacement'], 0.95
            elif any(device in question_lower for device in ['laptop', 'computer', 'macbook']):
                return cls.DEVICE_KNOWLEDGE['laptop_screen_replacement'], 0.95

        # Battery replacement queries (comprehensive matching)
        battery_terms = ['battery', 'power', 'charge', 'charging']
        battery_actions = ['replace', 'remove', 'change', 'install', 'fix', 'repair', 'swap', 'dead', 'dying', 'not holding charge']
        
        if any(term in question_lower for term in battery_terms) and any(action in question_lower for action in battery_actions):
            if any(device in question_lower for device in ['phone', 'smartphone', 'iphone', 'android']):
                return cls.DEVICE_KNOWLEDGE['phone_battery_replacement'], 0.95
            elif any(device in question_lower for device in ['laptop', 'computer', 'macbook']):
                return cls.DEVICE_KNOWLEDGE['laptop_battery_replacement'], 0.95

        # Charging port repair queries (comprehensive matching)
        port_terms = ['charging port', 'charge port', 'port', 'charging', 'charger', 'cable', 'connector']
        port_issues = ['fix', 'repair', 'replace', 'broken', 'not working', 'loose', 'damaged', "won't charge", "can't charge"]
        
        if any(term in question_lower for term in port_terms) and any(issue in question_lower for issue in port_issues):
            return cls.DEVICE_KNOWLEDGE['charging_port_repair'], 0.96

        # Phone troubleshooting queries (comprehensive matching)  
        power_issues = ['wont turn on', "won't turn on", 'not turning on', 'dead', 'not working', 'no power', 'black screen', 'not responding', 'frozen']
        
        if any(issue in question_lower for issue in power_issues):
            if any(device in question_lower for device in ['phone', 'iphone', 'android', 'smartphone']):
                return cls.DEVICE_KNOWLEDGE['phone_troubleshooting'], 0.97

        # Water damage queries (comprehensive matching)
        water_terms = ['water damage', 'water damaged', 'wet', 'dropped in water', 'liquid damage', 'spilled', 'submerged', 'moisture']
        
        if any(term in question_lower for term in water_terms):
            return cls.DEVICE_KNOWLEDGE['device_water_damage'], 0.97

        # General safety questions
        safety_terms = ['safe', 'safety', 'danger', 'careful', 'precaution', 'risk', 'hazard']
        
        if any(term in question_lower for term in safety_terms) and any(repair in question_lower for repair in ['repair', 'fix', 'replace']):
            return cls.DEVICE_KNOWLEDGE['general_repair_safety'], 0.92
            
        # If no match found, return None (will be denied)
        return None
    
    @classmethod
    def validate_repair_response(cls, response: str, question: str) -> tuple[bool, str, float]:
        """
        NLP-focused validation for response quality and relevance
        Returns: (is_valid, cleaned_response, confidence_score)
        """
        if not response or len(response.strip()) < 20:
            return False, "Response too short for meaningful repair guidance", 0.0
            
        response_lower = response.lower()
        question_lower = question.lower()
        
        # Check for obvious AI artifacts
        for phrase in cls.FORBIDDEN_PHRASES:
            if phrase in response_lower:
                return False, "Generic AI response detected", 0.3
        
        # Calculate relevance score based on content overlap
        question_words = set(question_lower.split())
        response_words = set(response_lower.split())
        overlap = len(question_words.intersection(response_words))
        
        # Calculate repair context score
        repair_score = sum(1 for keyword in cls.REPAIR_KEYWORDS if keyword in response_lower)
        
        # NLP quality metrics
        sentence_count = response.count('.') + response.count('!') + response.count('?')
        word_count = len(response.split())
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        # Base confidence on multiple NLP factors
        relevance_score = min(overlap / max(len(question_words), 1), 1.0)
        repair_relevance = min(repair_score / 3.0, 1.0)
        structure_score = min(avg_sentence_length / 15.0, 1.0)  # Good sentences are ~15 words
        
        # Combine scores with weights
        confidence = (
            relevance_score * 0.4 +      # 40% - relevance to question
            repair_relevance * 0.3 +     # 30% - repair context
            structure_score * 0.3        # 30% - structural quality
        )
        
        # Quality thresholds
        is_valid = confidence > 0.25  # Much lower threshold, focus on NLP quality
        
        logger.info(f"NLP Quality Metrics - Relevance: {relevance_score:.2f}, Repair: {repair_relevance:.2f}, Structure: {structure_score:.2f}, Final: {confidence:.2f}")
        
        return is_valid, response.strip(), confidence
    
    @classmethod
    def improve_prompt(cls, question: str) -> str:
        """Enhanced T5 prompt engineering for better NLP results"""
        
        question_lower = question.lower()
        
        # Detect device type for context
        device_type = "electronic device"
        if any(term in question_lower for term in ['iphone', 'phone', 'smartphone']):
            device_type = "smartphone"
        elif any(term in question_lower for term in ['ipad', 'tablet']):
            device_type = "tablet"  
        elif any(term in question_lower for term in ['laptop', 'macbook', 'computer']):
            device_type = "laptop"
        
        # Detect repair type for context
        repair_type = "general repair"
        if 'battery' in question_lower:
            repair_type = "battery replacement"
        elif any(term in question_lower for term in ['screen', 'display']):
            repair_type = "screen replacement"
        elif any(term in question_lower for term in ['charging', 'port']):
            repair_type = "charging port repair"
        elif any(term in question_lower for term in ['water', 'liquid']):
            repair_type = "water damage recovery"
        
        # T5-optimized prompt structure
        enhanced_prompt = f"""Context: Professional {device_type} {repair_type} guide
Task: Provide step-by-step repair instructions
Question: {question}
Requirements: Include tools needed, safety warnings, numbered steps
Style: Clear technical instructions

Instructions:"""
        
        return enhanced_prompt
    
    @classmethod
    def post_process_nlp_response(cls, response: str, question: str) -> str:
        """Production-grade post-processing for T5 model outputs"""
        
        response = response.strip()
        
        # Remove T5 artifacts and prompt remnants with better pattern matching
        artifacts_to_remove = [
            'repair_instruction:', 'question:', 'required_format:', 
            'professional_repair_guide:', 'repair_guide:', 'task:', 
            'domain:', 'requirements:', 'format:', 'Answer:', 'Instructions:'
        ]
        
        for artifact in artifacts_to_remove:
            if artifact in response:
                parts = response.split(artifact)
                if len(parts) > 1:
                    response = parts[-1].strip()
        
        # Enhanced formatting and structure validation
        lines = response.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            # Skip empty lines and artifact lines
            if line and not any(artifact.lower() in line.lower() for artifact in artifacts_to_remove):
                # Fix common T5 formatting issues with better patterns
                line = re.sub(r'Step\s*(\d+):', r'Step \1:', line)
                line = re.sub(r'Tools?:', 'Required Tools:', line)
                line = re.sub(r'Safety:', '⚠️ SAFETY:', line)
                line = re.sub(r'Warning:', '⚠️ WARNING:', line)
                
                # Fix numbering inconsistencies
                line = re.sub(r'^(\d+)\.?\s*-\s*', r'\1. ', line)
                line = re.sub(r'^\*\s*', '• ', line)
                
                cleaned_lines.append(line)
        
        response = '\n'.join(cleaned_lines)
        
        # Advanced sentence structure validation and fixing
        paragraphs = response.split('\n\n')
        fixed_paragraphs = []
        
        for paragraph in paragraphs:
            sentences = paragraph.split('. ')
            if len(sentences) > 1:
                # Remove incomplete final sentence if too short or malformed
                if len(sentences[-1]) < 15 or not sentences[-1].strip().endswith(('.', '!', ':')):
                    sentences = sentences[:-1]
                paragraph = '. '.join(sentences)
                if paragraph and not paragraph.endswith(('.', '!', ':')):
                    paragraph += '.'
            fixed_paragraphs.append(paragraph)
        
        response = '\n\n'.join(fixed_paragraphs)
        
        # Ensure proper capitalization and structure
        if response and response[0].islower():
            response = response[0].upper() + response[1:]
        
        # Production quality enhancements
        # Add required tools section if missing but tools are mentioned
        if 'Required Tools:' not in response and 'Tools needed:' not in response:
            tool_indicators = ['screwdriver', 'spudger', 'tweezers', 'opening tool', 'suction cup', 'heat gun', 'plastic tools']
            mentioned_tools = [tool for tool in tool_indicators if tool.lower() in response.lower()]
            if mentioned_tools:
                tools_section = f"Required Tools:\n- {chr(10).join([f'{tool.title()}' for tool in mentioned_tools])}\n\n"
                response = tools_section + response
        
        # Ensure safety warnings are properly formatted
        if any(word in response.lower() for word in ['safety', 'warning', 'caution', 'careful']):
            if not ('⚠️' in response):
                response = response.replace('Safety:', '⚠️ SAFETY:')
                response = response.replace('Warning:', '⚠️ WARNING:')
        
        return response
        sentences = response.split('. ')
        if len(sentences) > 1 and len(sentences[-1]) < 20:
            sentences = sentences[:-1]
            response = '. '.join(sentences) + '.'
        
        # 2. Ensure proper capitalization
        if response and response[0].islower():
            response = response[0].upper() + response[1:]
        
        # 3. Remove duplicate tool mentions
        tools_mentioned = set()
        lines = response.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            if line:
                # Check for tool repetition
                if 'Required Tools:' in line or 'Tools needed:' in line:
                    if not tools_mentioned:
                        tools_mentioned.add(line)
                        cleaned_lines.append(line)
                else:
                    cleaned_lines.append(line)
        
        # 4. Structure the response better
        response = '\n'.join(cleaned_lines)
        
        # 5. Add context if too generic
        if len(response) < 50 or response.count('.') < 2:
            response = f"To address your question about {question.lower().replace('how to ', '').replace('?', '')}: {response}"
        
        return response

# --- 2. THE "LIFESPAN" EVENT (Loads models after starting) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading models into memory...")
    try:
        # Look for models in parent directory structure
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # T5 Model path (check multiple possible locations)
        t5_model_paths = [
            './final_repair_model',
            '../final_repair_model',
            os.path.join(base_path, 'final_repair_model'),
            '.'  # Current directory has model files
        ]
        
        t5_model_path = None
        for path in t5_model_paths:
            if os.path.exists(os.path.join(path, 'config.json')):
                t5_model_path = path
                break
        
        if t5_model_path is None:
            # Try loading from current directory if config.json exists
            if os.path.exists('../config.json'):
                t5_model_path = '..'
            else:
                logger.warning("T5 model files not found in expected locations")
        
        # Sentence transformer path
        sentence_model_paths = [
            './sentence_transformer_model',
            '../sentence_transformer_model', 
            '../models_anomaly/sentence_transformer_model',
            os.path.join(base_path, 'models_anomaly', 'sentence_transformer_model')
        ]
        
        sentence_model_path = None
        for path in sentence_model_paths:
            if os.path.exists(os.path.join(path, 'config.json')):
                sentence_model_path = path
                break
        
        # Anomaly detector path
        anomaly_model_paths = [
            './anomaly_detector_model.pkl',
            '../anomaly_detector_model.pkl',
            '../models_anomaly/anomaly_detector_model.pkl',
            os.path.join(base_path, 'models_anomaly', 'anomaly_detector_model.pkl')
        ]
        
        anomaly_model_path = None
        for path in anomaly_model_paths:
            if os.path.exists(path):
                anomaly_model_path = path
                break
        
        # Load models if found
        if t5_model_path:
            logger.info(f"Loading T5 tokenizer from: {t5_model_path}")
            models['qna_tokenizer'] = T5Tokenizer.from_pretrained(t5_model_path)
            
            logger.info(f"Loading T5 model from: {t5_model_path}")
            models['qna_model'] = T5ForConditionalGeneration.from_pretrained(t5_model_path)
        else:
            logger.warning("T5 model not found - Q&A will not work")
        
        if sentence_model_path:
            logger.info(f"Loading sentence transformer from: {sentence_model_path}")
            models['encoder_model'] = SentenceTransformer(sentence_model_path)
        else:
            logger.warning("Sentence transformer not found - anomaly detection will not work")
        
        if anomaly_model_path:
            logger.info(f"Loading anomaly detector from: {anomaly_model_path}")
            models['anomaly_detector_model'] = joblib.load(anomaly_model_path)
        else:
            logger.warning("Anomaly detector not found - anomaly detection will not work")
        
        loaded_models = [k for k in models.keys()]
        logger.info(f"✅✅✅ Successfully loaded models: {loaded_models}")
        print(f"✅✅✅ Successfully loaded models: {loaded_models}")
        
    except Exception as e:
        logger.error(f"❌ ERROR: Failed to load models. {e}")
        print(f"❌ ERROR: Failed to load models. {e}")
        # Don't exit - allow API to start in demo mode
    
    yield
    models.clear()

# --- 3. INITIALIZE FASTAPI ---
app = FastAPI(
    title="Repair NLP Assistant API",
    lifespan=lifespan
)

# =================================================================
# ==> PRODUCTION CORS CONFIGURATION
# =================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8081", 
        "http://localhost:8082",
        "https://*.railway.app",
        "https://*.render.com",
        "https://*.vercel.app",
        "https://*.netlify.app",
        # Add your production domains here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# =================================================================

# ... (The rest of your API code is the same) ...

class QARequest(BaseModel):
    question: str

class QAResponse(BaseModel):
    answer: str
    confidence: Optional[float] = None
    is_safe_response: Optional[bool] = False

class AnomalyRequest(BaseModel):
    step_text: str

class AnomalyResponse(BaseModel):
    step_text: str
    is_anomaly: bool
    score: float

@app.get("/", summary="Root endpoint for health check")
def read_root():
    if 'qna_model' in models and 'anomaly_detector_model' in models:
        return {
            "status": "API is online and all models are loaded!",
            "models_loaded": {
                "qna_model": True,
                "encoder_model": True, 
                "anomaly_detector": True
            },
            "version": "1.0.0",
            "endpoints": ["/ask", "/detect"]
        }
    return {
        "status": "API is online, but models are still loading...",
        "models_loaded": {
            "qna_model": 'qna_model' in models,
            "encoder_model": 'encoder_model' in models,
            "anomaly_detector": 'anomaly_detector_model' in models
        }
    }

@app.get("/health", summary="Health check endpoint")
def health_check():
    return {"status": "healthy", "timestamp": __import__("datetime").datetime.now().isoformat()}

@app.get("/supported-repairs", summary="Get list of supported repair types and devices")
def get_supported_repairs():
    """Return comprehensive list of what our AI can help with"""
    return {
        "supported_devices": {
            "phones": ["iPhone (all models)", "Android smartphones", "General smartphones"],
            "laptops": ["All laptop brands", "MacBooks", "Windows laptops"],
            "notes": "We focus on common electronic devices. Tablets can often use phone repair guides."
        },
        "supported_repairs": {
            "battery_replacement": {
                "devices": ["phones", "laptops"],
                "confidence": "95-98%",
                "includes_tools": True,
                "includes_safety": True
            },
            "screen_replacement": {
                "devices": ["phones", "laptops"],
                "confidence": "95%",
                "includes_tools": True,
                "includes_safety": True
            },
            "charging_port_repair": {
                "devices": ["phones", "tablets", "laptops"],
                "confidence": "96%",
                "includes_tools": True,
                "includes_safety": True
            },
            "water_damage_recovery": {
                "devices": ["all electronic devices"],
                "confidence": "97%",
                "emergency_steps": True,
                "includes_safety": True
            },
            "troubleshooting": {
                "devices": ["phones"],
                "issues": ["won't turn on", "power problems", "basic diagnostics"],
                "confidence": "97%"
            },
            "general_safety": {
                "devices": ["all devices"],
                "confidence": "92%",
                "covers": ["tools", "precautions", "best practices"]
            }
        },
        "specialty_guides": {
            "iphone_7_battery": "Detailed iPhone 7 specific battery replacement (98% confidence)"
        },
        "not_supported": [
            "Software issues",
            "Operating system repairs", 
            "Advanced circuit board repairs",
            "Specialized components (cameras, speakers in detail)",
            "Warranty or legal advice"
        ],
        "recommendation": "For unsupported repairs, we recommend consulting a professional technician or manufacturer support."
    }

@app.post("/ask", response_model=QAResponse)
def ask_question(request: QARequest):
    """Enhanced T5-based repair assistant with strict validation"""
    try:
        # STEP 1: Check our high-quality knowledge base first
        knowledge_response = ResponseValidator.get_knowledge_based_response(request.question)
        if knowledge_response:
            answer, confidence = knowledge_response
            logger.info(f"✅ Knowledge base match: {request.question[:50]}...")
            return QAResponse(
                answer=answer,
                confidence=confidence,
                is_safe_response=True
            )

        # STEP 2: Enhanced T5 model with strict domain validation
        if 'qna_model' not in models or 'qna_tokenizer' not in models:
            raise HTTPException(
                status_code=503, 
                detail="AI model is still loading. Please try again in a moment."
            )
        
        # STEP 3: Pre-validate question domain before T5 processing
        question_lower = request.question.lower()
        
        # Define strict repair domain terms
        repair_terms = ['battery', 'screen', 'display', 'charging', 'port', 'speaker', 'microphone', 'camera', 'button', 'repair', 'fix', 'replace', 'broken']
        device_terms = ['phone', 'iphone', 'android', 'smartphone', 'tablet', 'ipad', 'laptop', 'computer']
        
        has_repair_context = any(term in question_lower for term in repair_terms)
        has_device_context = any(term in question_lower for term in device_terms)
        
        if not (has_repair_context and has_device_context):
            logger.info(f"❌ Question outside repair domain: {request.question}")
            return QAResponse(
                answer="I specialize in electronic device repairs (phones, tablets, laptops) for components like batteries, screens, charging ports, and speakers. For other topics, please consult an appropriate specialist.",
                confidence=0.9,
                is_safe_response=True
            )

        # STEP 4: Production-grade T5 prompt engineering 
        device_context = "electronic device"
        repair_context = "repair procedure"
        
        # Extract semantic context for better prompting
        if any(term in question_lower for term in ['iphone', 'phone', 'smartphone']):
            device_context = "smartphone device"
        elif any(term in question_lower for term in ['ipad', 'tablet']):
            device_context = "tablet device"  
        elif any(term in question_lower for term in ['laptop', 'macbook', 'computer']):
            device_context = "laptop computer"
            
        if 'battery' in question_lower:
            repair_context = "battery replacement procedure"
        elif any(term in question_lower for term in ['screen', 'display']):
            repair_context = "screen replacement procedure"
        elif any(term in question_lower for term in ['charging', 'port']):
            repair_context = "charging port repair procedure"
        elif any(term in question_lower for term in ['water', 'liquid']):
            repair_context = "water damage recovery procedure"
        
        # Production T5 prompt with clear structure and context
        enhanced_prompt = f"""repair_instruction: {device_context} {repair_context}
        
question: {request.question}

required_format:
- list_required_tools_first
- provide_numbered_steps  
- include_safety_warnings
- be_specific_and_accurate

professional_repair_guide:"""
        
        logger.info(f"🤖 Processing with enhanced T5 model: {request.question[:50]}...")
        
        # T5 tokenization with better parameters
        input_ids = models['qna_tokenizer'](
            enhanced_prompt, 
            return_tensors="pt", 
            max_length=256,
            truncation=True,
            padding=True
        ).input_ids
        
        # Enhanced T5 generation with production-grade parameters optimized for repair domain
        with torch.no_grad():
            outputs = models['qna_model'].generate(
                input_ids,
                # Optimized generation parameters for technical repair instructions
                max_length=280,              # Extended for comprehensive repair guides
                min_length=60,               # Ensure detailed technical responses
                num_beams=12,                # Enhanced beam search for superior quality
                temperature=0.55,            # Optimal temperature for precise technical content
                do_sample=True,
                early_stopping=False,       # Full beam exploration for quality
                
                # Advanced anti-hallucination and quality controls
                no_repeat_ngram_size=4,      # Prevent repetitive patterns
                repetition_penalty=1.5,      # Strong penalty for better content quality
                length_penalty=1.1,          # Encourage comprehensive instructions
                diversity_penalty=0.1,       # Light diversity for technical consistency
                
                # Token management and constraints
                pad_token_id=models['qna_tokenizer'].eos_token_id,
                eos_token_id=models['qna_tokenizer'].eos_token_id,
                
                # Nucleus sampling for controlled high-quality generation
                top_k=25,                    # Tighter vocabulary restriction for precision
                top_p=0.75,                  # Enhanced nucleus sampling for coherent outputs
                
                # Production-grade stability and performance
                use_cache=True,              # Enable KV caching for efficiency
                output_scores=True,          # Token scores for confidence calculation
                return_dict_in_generate=True, # Detailed generation info
                
                # Advanced technical instruction optimization
                exponential_decay_length_penalty=(60, 1.02),  # Progressive length penalty
                encoder_no_repeat_ngram_size=3,               # Encoder-side repetition control
                forced_eos_token_id=models['qna_tokenizer'].eos_token_id
            )
        
        # Extract the generated sequence and calculate confidence from token scores
        generated_ids = outputs.sequences[0]
        token_scores = outputs.scores if hasattr(outputs, 'scores') else None
        
        # Calculate advanced generation confidence from token probabilities with domain-specific analysis
        generation_confidence = 1.0
        if token_scores:
            # Advanced confidence calculation with repair domain awareness
            token_probs = []
            repair_keywords = ['step', 'tool', 'screw', 'battery', 'screen', 'cable', 'connector', 'safety', 'remove', 'install', 'replace']
            
            for score_tensor in token_scores:
                if score_tensor.numel() > 0:
                    # Convert logits to probabilities
                    probs = torch.softmax(score_tensor.float(), dim=-1)
                    max_prob = torch.max(probs).item()
                    
                    # Get entropy for uncertainty measurement
                    entropy = -(probs * torch.log(probs + 1e-10)).sum().item()
                    uncertainty_penalty = max(0, (entropy - 2.0) / 8.0)  # Penalize high uncertainty
                    
                    adjusted_prob = max_prob * (1 - uncertainty_penalty)
                    token_probs.append(adjusted_prob)
            
            if token_probs:
                # Use geometric mean for conservative confidence estimation
                import math
                log_sum = sum(math.log(max(p, 1e-10)) for p in token_probs)
                base_confidence = math.exp(log_sum / len(token_probs))
                
                # Apply length-based scaling for optimal response size
                response_length = len(token_probs)
                if 40 <= response_length <= 180:  # Optimal range for repair instructions
                    length_multiplier = 1.0 + (0.1 * (1 - abs(response_length - 110) / 70))
                else:
                    length_multiplier = 0.9  # Penalty for too short/long responses
                
                generation_confidence = min(base_confidence * length_multiplier, 1.0)
            else:
                generation_confidence = 0.5  # Fallback for missing scores
        
        # Decode with better handling
        raw_answer = models['qna_tokenizer'].decode(generated_ids, skip_special_tokens=True)
        
        # STEP 5: Clean up T5 response format
        if "Repair Instructions:" in raw_answer:
            answer = raw_answer.split("Repair Instructions:")[-1].strip()
        else:
            answer = raw_answer.strip()
        
        # Remove prompt artifacts
        answer = answer.replace("repair_guide:", "").replace("task:", "").replace("domain:", "")
        answer = answer.replace("question:", "").replace("requirements:", "").replace("format:", "")
        
        # STEP 6: Enhanced post-processing and validation
        answer = ResponseValidator.post_process_nlp_response(answer, request.question)
        
        # STEP 7: Production-grade response validation with multiple confidence metrics
        is_valid, validated_answer, base_confidence = ResponseValidator.validate_repair_response(answer, request.question)
        
        # Combine generation confidence with validation confidence
        final_confidence = (generation_confidence * 0.4) + (base_confidence * 0.6)
        
        logger.info(f"✅ T5 Generation completed - Base confidence: {generation_confidence:.3f}, Response length: {len(validated_answer)} chars")
        
        # Enhanced validation quality metrics for AI engineering insights
        quality_metrics = {
            'generation_confidence': generation_confidence,
            'validation_confidence': base_confidence,
            'combined_confidence': final_confidence,
            'response_length': len(validated_answer),
            'has_safety_warnings': '⚠️' in validated_answer,
            'has_structured_steps': any(marker in validated_answer.lower() for marker in ['step', 'required tools', '1.', '2.']),
            'repair_relevance': any(term in validated_answer.lower() for term in ['repair', 'replace', 'fix', 'install', 'remove'])
        }
        
        logger.info(f"📊 Quality Metrics: {quality_metrics}")
        
        # AI Engineering quality gates with detailed diagnostics
        min_confidence_threshold = 0.62  # Production threshold tuned for repair domain
        min_answer_length = 80           # Ensure comprehensive repair instructions
        
        # Comprehensive validation checks
        quality_checks = {
            'confidence_check': final_confidence >= min_confidence_threshold,
            'length_check': len(validated_answer.strip()) >= min_answer_length,
            'safety_check': is_valid,
            'structure_check': quality_metrics['has_structured_steps'],
            'domain_relevance': quality_metrics['repair_relevance']
        }
        
        failed_checks = [check for check, passed in quality_checks.items() if not passed]
        
        if failed_checks:
            logger.warning(f"⚠️  Quality check failures: {failed_checks}")
            logger.info(f"📋 Response preview: {validated_answer[:100]}...")
            
            # Provide diagnostic information for AI engineering improvement
            if not quality_checks['confidence_check']:
                logger.warning(f"Low confidence: {final_confidence:.3f} < {min_confidence_threshold}")
            if not quality_checks['structure_check']:
                logger.warning("Response lacks proper structure (steps/tools)")
            if not quality_checks['domain_relevance']:
                logger.warning("Response may not be repair-domain relevant")
        
        # Quality gate enforcement
        if not all([quality_checks['confidence_check'], quality_checks['safety_check']]):
            # Use knowledge base fallback for low-quality responses
            fallback_response = f"""
I understand you're asking about {request.question.lower()}. 

For device repair guidance, I recommend:

1. **Safety First**: Power off your device and disconnect from power
2. **Proper Tools**: Use appropriate screwdrivers and plastic opening tools  
3. **Professional Help**: For complex repairs, consider professional service
4. **Warranty**: Check if your device is still under warranty

⚠️ SAFETY: Always work in a static-free environment and handle components carefully.

For detailed step-by-step instructions, please specify your exact device model and the specific issue you're experiencing.
"""
            return {
                "answer": fallback_response,
                "confidence": 0.75,
                "source": "fallback_guidance",
                "reasoning": f"Quality checks failed: {failed_checks}"
            }
        
        # Production quality control
        quality_score = sum(quality_checks.values()) / len(quality_checks)
        
        if quality_score < 0.8:  # 80% of quality checks must pass
            logger.warning(f"⚠️ T5 response failed production quality gates: {quality_score:.2f}")
            return QAResponse(
                answer="I don't have enough reliable knowledge for this specific repair. For your safety and the best results, I recommend consulting a certified technician or the device manufacturer's official repair documentation.",
                confidence=0.85,
                is_safe_response=True
            )
        
        # Adjust confidence based on quality score
        production_confidence = final_confidence * quality_score
        
        # STEP 8: Apply repair knowledge correction if available
        if 'repair_corrector' in models:
            validated_answer = models['repair_corrector'].correct_response(validated_answer, request.question)
        
        logger.info(f"✅ Production T5 response: {production_confidence:.2f} confidence, quality: {quality_score:.2f}")
        
        return QAResponse(
            answer=validated_answer,
            confidence=production_confidence,
            is_safe_response=True
        )
        
        # Improve the prompt to reduce hallucination
        improved_question = ResponseValidator.improve_prompt(request.question)
        
        logger.info(f"Processing improved question: {improved_question[:100]}...")
        
        input_ids = models['qna_tokenizer'](improved_question, return_tensors="pt", max_length=512, truncation=True).input_ids
        
        # NLP-optimized generation parameters for better quality and coherence
        outputs = models['qna_model'].generate(
            input_ids, 
            max_length=300,          # Increased for detailed steps
            min_length=50,           # Ensure comprehensive answers
            num_beams=5,             # Better beam search for quality
            temperature=0.8,         # Balanced creativity vs consistency
            do_sample=True,
            early_stopping=True,
            no_repeat_ngram_size=3,  # Prevent repetitive phrases
            repetition_penalty=1.2,  # Discourage repetition
            length_penalty=1.0,      # Neutral length bias
            pad_token_id=models['qna_tokenizer'].eos_token_id,
            # Advanced parameters for better coherence
            top_k=50,               # Limit vocabulary for coherence
            top_p=0.9,              # Nucleus sampling for quality
        )
        
        answer = models['qna_tokenizer'].decode(outputs[0], skip_special_tokens=True)
        
        # Quick validation - reject questions outside training domain 
        question_lower = request.question.lower()
        
        # Define what your model was actually trained on (electronics/device repair)
        valid_domains = ['phone', 'iphone', 'android', 'smartphone', 'tablet', 'ipad', 
                        'device', 'electronics', 'circuit', 'battery', 'screen', 
                        'headphones', 'earbuds', 'speaker', 'charger', 'cable']
        
        is_valid_domain = any(domain in question_lower for domain in valid_domains)
        
        if not is_valid_domain:
            # Out of training domain - honest response
            return QAResponse(
                answer=f"I'm specialized in electronics and device repair. For {request.question.lower().replace('how to repair', '').replace('?', '').strip()}, I recommend consulting a specialist in that field or checking the manufacturer's manual.",
                confidence=0.8,
                is_safe_response=True
            )
        
        # For valid electronics questions, clean up model hallucinations
        
        # Clean up the response format based on new prompt structure
        if "Answer:" in answer:
            answer = answer.split("Answer:")[-1].strip()
        if "repair_context:" in answer:
            # Remove prompt artifacts
            lines = answer.split('\n')
            answer = '\n'.join([line for line in lines if not line.startswith(('repair_context:', 'question:', 'constraints:', 'format:'))])
        
        # NLP post-processing for better quality
        answer = ResponseValidator.post_process_nlp_response(answer, request.question)
        
        # CRITICAL: Apply domain knowledge correction for model biases
        if not RepairKnowledgeCorrector.validate_device_context(answer, request.question):
            logger.warning(f"Device context mismatch detected, applying correction")
            answer = RepairKnowledgeCorrector.correct_response(answer, request.question)
        
        # Validate and filter response
        is_valid, cleaned_answer, confidence = ResponseValidator.validate_repair_response(
            answer, request.question
        )
        
        # If confidence is too low, provide a safe fallback
        if not is_valid or confidence < 0.15:  # Much lower threshold for speed
            logger.warning(f"Low confidence response ({confidence:.2f}): {answer[:50]}...")
            fallback_answer = f"I recommend consulting the manual or a qualified technician for {request.question.lower().replace('how to ', '').replace('?', '')}. This type of repair may require specific tools and expertise."
            return QAResponse(
                answer=fallback_answer,
                confidence=0.7,  
                is_safe_response=True
            )
        
        logger.info(f"Generated valid response with confidence: {confidence:.2f}")
        return QAResponse(
            answer=cleaned_answer,
            confidence=confidence,
            is_safe_response=False
        )
        
    except Exception as e:
        logger.error(f"Error in ask_question: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

class SafetyValidator:
    """Enhanced safety validation for repair steps"""
    
    DANGER_KEYWORDS = [
        'forcefully', 'force', 'hammer', 'pliers', 'yank', 'pull hard',
        'break', 'smash', 'bend', 'twist', 'snap', 'crack',
        'wet hands', 'water', 'liquid', 'damp', 'moisture',
        'skip', 'ignore', 'bypass', 'shortcut',
        'blowtorch', 'flame', 'fire', 'torch', 'lighter',
        'acetone', 'acid', 'bleach', 'chemicals',
        'powered on', 'while on', 'energized', 'live circuit'
    ]
    
    SAFETY_VIOLATIONS = [
        'skip disconnecting battery',
        'ignore safety',
        'work quickly without care',
        'use excessive force',
        'touch circuit while powered',
        'work with wet hands',
        'heat with open flame',
        'use wrong tools'
    ]
    
    SAFE_KEYWORDS = [
        'carefully', 'gently', 'slowly', 'proper', 'appropriate',
        'safety', 'disconnect battery first', 'power off',
        'plastic tool', 'spudger', 'opening tool', 'suction cup',
        'heat gun', 'hair dryer', 'isopropyl alcohol',
        'anti-static', 'well-ventilated', 'protective'
    ]
    
    @classmethod
    def validate_safety(cls, step_text: str) -> tuple[bool, float, str]:
        """
        Enhanced safety validation using rule-based detection
        Returns: (is_safe, danger_score, explanation)
        """
        step_lower = step_text.lower()
        
        # Check for explicit danger keywords
        danger_count = sum(1 for keyword in cls.DANGER_KEYWORDS if keyword in step_lower)
        
        # Check for safety violations
        violation_count = sum(1 for violation in cls.SAFETY_VIOLATIONS if violation in step_lower)
        
        # Check for safe practices
        safe_count = sum(1 for keyword in cls.SAFE_KEYWORDS if keyword in step_lower)
        
        # Calculate danger score (0 = safe, 1 = very dangerous)
        danger_score = (danger_count * 0.3 + violation_count * 0.5) / max(safe_count + 1, 1)
        
        # Specific dangerous pattern detection
        specific_dangers = [
            ('forcefully' in step_lower and ('pull' in step_lower or 'remove' in step_lower)),
            ('wet hands' in step_lower and 'circuit' in step_lower),
            ('hammer' in step_lower or 'pliers' in step_lower),
            ('skip' in step_lower and 'battery' in step_lower),
            ('force' in step_lower and ('break' in step_lower or 'until' in step_lower)),
        ]
        
        if any(specific_dangers):
            danger_score = max(danger_score, 0.8)  # High danger score
        
        is_safe = danger_score < 0.3  # Lower threshold for safety
        
        # Generate explanation
        if danger_score > 0.7:
            explanation = "⚠️ HIGH RISK: This step contains dangerous practices that could cause injury or device damage!"
        elif danger_score > 0.3:
            explanation = "⚠️ MODERATE RISK: This step may not follow safe repair procedures."
        else:
            explanation = "✅ This step appears to follow safe repair procedures."
            
        return is_safe, danger_score, explanation

@app.post("/detect", response_model=AnomalyResponse)
def detect_anomaly(request: AnomalyRequest):
    try:
        # First, use rule-based safety validation
        is_safe, danger_score, safety_explanation = SafetyValidator.validate_safety(request.step_text)
        
        # If rule-based validation detects high danger, override ML model
        if danger_score > 0.5:
            logger.info(f"Rule-based safety violation detected: {request.step_text[:30]}... | Danger Score: {danger_score:.3f}")
            return AnomalyResponse(
                step_text=request.step_text,
                is_anomaly=True,
                score=float(danger_score)
            )
        
        # Use ML model for subtle anomaly detection
        if 'encoder_model' not in models or 'anomaly_detector_model' not in models:
            # Fallback to rule-based only if models not available
            return AnomalyResponse(
                step_text=request.step_text,
                is_anomaly=not is_safe,
                score=float(danger_score)
            )

        # ML-based anomaly detection
        embedding = models['encoder_model'].encode([request.step_text])
        ml_score = models['anomaly_detector_model'].decision_function(embedding)[0]
        ml_prediction = models['anomaly_detector_model'].predict(embedding)[0]
        ml_is_anomaly = True if ml_prediction == -1 else False
        
        # Combine rule-based and ML results (prioritize safety)
        # If either system detects danger, flag as anomaly
        final_is_anomaly = (not is_safe) or ml_is_anomaly or (danger_score > 0.3)
        
        # Use higher of the two scores
        final_score = max(danger_score, abs(float(ml_score)))
        
        # Ensure dangerous steps are properly flagged
        if any(keyword in request.step_text.lower() for keyword in ['forcefully', 'hammer', 'wet hands', 'skip']):
            final_is_anomaly = True
            final_score = max(final_score, 0.8)
        
        logger.info(f"Combined anomaly detection: {request.step_text[:30]}... | Rule: {danger_score:.3f} | ML: {ml_score:.3f} | Final: {final_is_anomaly}")
        
        return AnomalyResponse(
            step_text=request.step_text,
            is_anomaly=final_is_anomaly,
            score=float(final_score)
        )
        
    except Exception as e:
        logger.error(f"Error in detect_anomaly: {e}")
        # Fallback safety check
        is_safe, danger_score, _ = SafetyValidator.validate_safety(request.step_text)
        return AnomalyResponse(
            step_text=request.step_text,
            is_anomaly=not is_safe,
            score=float(danger_score)
        )

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)