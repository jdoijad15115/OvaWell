#!/usr/bin/env python3
"""
Model Quality Diagnostic Script
Tests the actual T5 model performance without filters
"""

import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer
import os

def load_model():
    """Load your trained model"""
    print("Loading your trained T5 model...")
    
    # Try different model paths
    model_paths = [
        '/Users/janhvidoijad/Downloads/model_qna',
        './final_repair_model', 
        '..'
    ]
    
    model = None
    tokenizer = None
    
    for path in model_paths:
        try:
            if os.path.exists(os.path.join(path, 'config.json')):
                print(f"Found model in: {path}")
                tokenizer = T5Tokenizer.from_pretrained(path)
                model = T5ForConditionalGeneration.from_pretrained(path)
                break
        except Exception as e:
            print(f"Failed to load from {path}: {e}")
    
    if model is None:
        print("❌ Could not load your trained model!")
        return None, None
    
    print("✅ Successfully loaded your trained model")
    return model, tokenizer

def test_model_quality(model, tokenizer):
    """Test model with different prompting strategies"""
    
    test_questions = [
        "How do I replace a broken iPhone screen?",
        "My laptop won't turn on, how to fix it?", 
        "Steps to repair a cracked smartphone display",
        "What tools do I need to fix a computer?",
        "How to troubleshoot a phone battery issue?"
    ]
    
    print("\n🧪 TESTING MODEL QUALITY")
    print("=" * 60)
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n📝 Test {i}: {question}")
        print("-" * 50)
        
        # Test 1: Simple prompt (your current approach)
        simple_prompt = f"question: {question}"
        simple_response = generate_response(model, tokenizer, simple_prompt)
        print(f"🔸 Simple Prompt: {simple_response[:100]}...")
        
        # Test 2: Structured prompt  
        structured_prompt = f"repair_task: {question}\nresponse_format: step_by_step\noutput:"
        structured_response = generate_response(model, tokenizer, structured_prompt)
        print(f"🔹 Structured Prompt: {structured_response[:100]}...")
        
        # Test 3: Context-rich prompt
        context_prompt = f"You are a repair technician. Question: {question} Provide specific repair steps:"
        context_response = generate_response(model, tokenizer, context_prompt)
        print(f"🔺 Context Prompt: {context_response[:100]}...")
        
        print()

def generate_response(model, tokenizer, prompt, max_attempts=3):
    """Generate response with different parameters to find best quality"""
    
    # Try different generation strategies
    strategies = [
        # Conservative
        {"max_length": 150, "num_beams": 4, "temperature": 0.7, "do_sample": True},
        # Creative  
        {"max_length": 200, "num_beams": 3, "temperature": 0.9, "do_sample": True},
        # Deterministic
        {"max_length": 180, "num_beams": 5, "do_sample": False}
    ]
    
    try:
        inputs = tokenizer.encode(prompt, return_tensors="pt", max_length=512, truncation=True)
        
        with torch.no_grad():
            # Try the first strategy (most balanced)
            outputs = model.generate(
                inputs,
                max_length=strategies[0]["max_length"],
                num_beams=strategies[0]["num_beams"], 
                temperature=strategies[0]["temperature"],
                do_sample=strategies[0]["do_sample"],
                early_stopping=True,
                no_repeat_ngram_size=2,
                pad_token_id=tokenizer.eos_token_id
            )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Clean up response
        if prompt in response:
            response = response.replace(prompt, "").strip()
        
        return response if response else "No response generated"
        
    except Exception as e:
        return f"Generation error: {str(e)}"

def analyze_model_architecture():
    """Analyze if the model architecture is suitable"""
    print("\n🏗️ MODEL ARCHITECTURE ANALYSIS")
    print("=" * 60)
    
    config_path = "/Users/janhvidoijad/Downloads/model_qna/config.json"
    if os.path.exists(config_path):
        import json
        with open(config_path) as f:
            config = json.load(f)
        
        print(f"📊 Model Type: {config.get('model_type', 'Unknown')}")
        print(f"📊 Model Size: {config.get('d_model', 'Unknown')} dimensions")
        print(f"📊 Layers: {config.get('num_layers', 'Unknown')} encoder + {config.get('num_decoder_layers', 'Unknown')} decoder")
        print(f"📊 Attention Heads: {config.get('num_heads', 'Unknown')}")
        print(f"📊 Max Length: {config.get('n_positions', 'Unknown')}")
        
        # Assess if this is appropriate for repair tasks
        d_model = config.get('d_model', 0)
        num_layers = config.get('num_layers', 0)
        
        if d_model >= 512 and num_layers >= 6:
            print("✅ Model size appears adequate for repair Q&A tasks")
        else:
            print("⚠️ Model may be too small for complex repair instructions")
    else:
        print("❌ Could not find model config")

if __name__ == "__main__":
    print("🔬 REPAIR MODEL QUALITY DIAGNOSTIC")
    print("=" * 60)
    
    # Load model
    model, tokenizer = load_model()
    
    if model and tokenizer:
        # Test model quality
        test_model_quality(model, tokenizer)
        
        # Analyze architecture  
        analyze_model_architecture()
        
        print("\n🎯 DIAGNOSIS COMPLETE")
        print("Check the outputs above to assess:")
        print("1. Is the model generating coherent responses?")
        print("2. Do different prompts improve quality?")
        print("3. Is the model size appropriate for the task?")
        
    else:
        print("❌ Cannot run diagnostic - model failed to load")
