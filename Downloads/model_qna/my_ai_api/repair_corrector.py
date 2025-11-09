"""
EMERGENCY FIX: Add domain knowledge rules to correct model bias
"""
import re

class RepairKnowledgeCorrector:
    """Corrects obvious model biases using domain knowledge"""
    
    DEVICE_CORRECTIONS = {
        'laptop': {
            'wrong_tools': ['spudger', 'plastic opening tool', 'iOpener'],
            'correct_approach': 'For laptop issues, first check power adapter, then remove bottom panel with appropriate screws.',
            'common_fixes': ['power adapter', 'RAM reseating', 'hard drive check', 'cooling fan cleaning']
        },
        'computer': {
            'wrong_tools': ['spudger', 'plastic opening tool'],
            'correct_approach': 'For computer troubleshooting, check power supply, connections, and components.',
            'common_fixes': ['power supply', 'RAM check', 'cable connections', 'component testing']
        }
    }
    
    @classmethod
    def correct_response(cls, response: str, question: str) -> str:
        """Apply domain knowledge to correct obvious model mistakes"""
        
        question_lower = question.lower()
        response_lower = response.lower()
        
        # Detect device type
        device_type = None
        if 'laptop' in question_lower:
            device_type = 'laptop'
        elif 'computer' in question_lower and 'phone' not in question_lower:
            device_type = 'computer'
        elif any(word in question_lower for word in ['phone', 'smartphone', 'iphone']):
            device_type = 'phone'
            
        # Apply corrections based on device type
        if device_type in cls.DEVICE_CORRECTIONS:
            corrections = cls.DEVICE_CORRECTIONS[device_type]
            
            # Check for wrong tools
            for wrong_tool in corrections['wrong_tools']:
                if wrong_tool in response_lower:
                    # Replace with device-appropriate guidance
                    corrected_response = f"{corrections['correct_approach']} "
                    corrected_response += f"Common steps include: {', '.join(corrections['common_fixes'])}."
                    return corrected_response
        
        # Fix battery removal for troubleshooting battery issues
        if 'battery' in question_lower and 'troubleshoot' in question_lower:
            if 'remove the battery' in response_lower:
                return "To troubleshoot battery issues: 1) Check charging cable and adapter, 2) Try different power outlet, 3) Check for software battery calibration options, 4) Monitor battery usage in settings. Only remove battery if other steps fail and you have proper tools."
        
        # Fix tool recommendations for general questions
        if 'what tools' in question_lower:
            if 'spudger' in response_lower and 'computer' in question_lower:
                return "For computer repair, essential tools include: Phillips head screwdrivers (various sizes), anti-static wrist strap, thermal paste, compressed air, multimeter for testing, and a clean workspace. Avoid using plastic prying tools meant for mobile devices."
        
        return response
        
    @classmethod
    def validate_device_context(cls, response: str, question: str) -> bool:
        """Check if response makes sense for the device type"""
        
        question_lower = question.lower()
        response_lower = response.lower()
        
        # Phone-specific tools used for non-phone devices
        phone_tools = ['spudger', 'iopener', 'plastic opening tool']
        non_phone_devices = ['laptop', 'computer', 'desktop', 'pc']
        
        has_phone_tools = any(tool in response_lower for tool in phone_tools)
        has_non_phone_device = any(device in question_lower for device in non_phone_devices)
        
        if has_phone_tools and has_non_phone_device:
            return False  # Invalid combination
            
        return True
