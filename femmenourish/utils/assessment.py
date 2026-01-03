"""
PCOS Assessment Module
Handles Rotterdam criteria evaluation and risk scoring.
"""

import json
from typing import Dict, List, Optional


class PCOSAssessment:
    def __init__(self, criteria_file: str = "config/pcos_rules.json"):
        """
        Initialize assessment module with PCOS criteria.
        
        Args:
            criteria_file: Path to PCOS criteria JSON file
        """
        with open(criteria_file, 'r') as f:
            self.criteria_data = json.load(f)
        
        self.rotterdam = self.criteria_data['rotterdam_criteria']
        self.phenotypes = self.criteria_data['phenotypes']
        self.risk_factors = self.criteria_data['risk_factors']
    
    def evaluate_rotterdam_criteria(
        self,
        symptoms: Dict,
        ultrasound_result: Optional[Dict] = None
    ) -> Dict:
        """
        Evaluate Rotterdam criteria (2 out of 3 required for PCOS diagnosis).
        
        Args:
            symptoms: Patient symptom data
            ultrasound_result: Optional ultrasound analysis
        
        Returns:
            Dict with criteria evaluation
        """
        criteria_met = []
        evidence = {}
        
        # Criterion 1: Oligo-ovulation/Anovulation
        periods_per_year = symptoms.get('periods_per_year', 12)
        cycle_length = symptoms.get('cycle_length', 28)
        
        if periods_per_year < 9 or cycle_length > 35:
            criteria_met.append("oligoanovulation")
            if periods_per_year < 9:
                evidence["oligoanovulation"] = f"Irregular menstrual cycles - only {periods_per_year} periods per year (< 9 indicates oligo-ovulation)"
            else:
                evidence["oligoanovulation"] = f"Prolonged menstrual cycles - average {cycle_length} days (> 35 days indicates irregular ovulation)"
        else:
            evidence["oligoanovulation"] = "Regular menstrual cycles - criterion not met"
        
        # Criterion 2: Hyperandrogenism
        has_hirsutism = symptoms.get('hirsutism', False)
        has_acne = symptoms.get('acne', False)
        has_hair_loss = symptoms.get('hair_loss', False)
        has_elevated_testosterone = symptoms.get('testosterone_elevated', False)
        
        hyperandrogenism_signs = []
        if has_hirsutism:
            hyperandrogenism_signs.append("hirsutism (excess facial/body hair)")
        if has_acne:
            hyperandrogenism_signs.append("acne (especially jawline/chest)")
        if has_hair_loss:
            hyperandrogenism_signs.append("androgenic alopecia (hair thinning)")
        if has_elevated_testosterone:
            hyperandrogenism_signs.append("elevated testosterone (biochemical)")
        
        if len(hyperandrogenism_signs) > 0:
            criteria_met.append("hyperandrogenism")
            evidence["hyperandrogenism"] = f"Clinical/biochemical signs present: {', '.join(hyperandrogenism_signs)}"
        else:
            evidence["hyperandrogenism"] = "No clinical or biochemical signs of hyperandrogenism - criterion not met"
        
        # Criterion 3: Polycystic ovaries on ultrasound
        if ultrasound_result and ultrasound_result.get('pcos_pattern') == 'positive':
            criteria_met.append("polycystic_ovaries")
            cyst_count = ultrasound_result.get('cyst_count_estimate', 'unknown')
            volume = ultrasound_result.get('ovarian_volume_estimate', 'unknown')
            evidence["polycystic_ovaries"] = f"Ultrasound shows polycystic morphology - {cyst_count} follicles, {volume}"
        elif ultrasound_result:
            evidence["polycystic_ovaries"] = "Ultrasound does not show polycystic morphology - criterion not met"
        else:
            evidence["polycystic_ovaries"] = "No ultrasound provided - criterion cannot be evaluated"
        
        # Determine diagnosis
        rotterdam_score = len(criteria_met)
        diagnosis = "PCOS" if rotterdam_score >= 2 else "Not PCOS"
        
        # Determine phenotype if PCOS
        phenotype = None
        if diagnosis == "PCOS":
            phenotype = self._determine_phenotype(criteria_met)
        
        return {
            "rotterdam_score": f"{rotterdam_score}/3",
            "criteria_met": criteria_met,
            "diagnosis": diagnosis,
            "phenotype": phenotype,
            "evidence": evidence,
            "criteria_count": rotterdam_score
        }
    
    def _determine_phenotype(self, criteria_met: List[str]) -> Optional[str]:
        """
        Determine PCOS phenotype based on which criteria are met.
        
        Args:
            criteria_met: List of criteria that are met
        
        Returns:
            Phenotype letter (A, B, C, D) or None
        """
        criteria_set = set(criteria_met)
        
        for phenotype_id, phenotype_data in self.phenotypes.items():
            phenotype_criteria = set(phenotype_data['criteria'])
            if criteria_set == phenotype_criteria:
                return phenotype_id
        
        return None
    
    def calculate_risk_score(
        self,
        symptoms: Dict,
        patient_history: Dict
    ) -> int:
        """
        Calculate overall PCOS risk score (0-100) based on symptoms and risk factors.
        
        Args:
            symptoms: Patient symptom data
            patient_history: Family history, BMI, etc.
        
        Returns:
            Risk score from 0-100
        """
        base_score = 0
        
        # Check each risk factor
        if patient_history.get('family_history'):
            base_score += self.risk_factors['family_history']['risk_increase']
        
        bmi = patient_history.get('bmi', 0)
        if bmi >= 30:
            base_score += self.risk_factors['obesity']['risk_increase']
        
        if patient_history.get('insulin_resistance'):
            base_score += self.risk_factors['insulin_resistance']['risk_increase']
        
        if patient_history.get('metabolic_syndrome'):
            base_score += self.risk_factors['metabolic_syndrome']['risk_increase']
        
        # Add points for symptoms
        if symptoms.get('periods_per_year', 12) < 9:
            base_score += 15
        
        if symptoms.get('hirsutism'):
            base_score += 10
        
        if symptoms.get('acne'):
            base_score += 10
        
        # Cap at 100
        return min(100, base_score)
    
    def get_recommendations(
        self,
        diagnosis: str,
        phenotype: Optional[str],
        risk_score: int
    ) -> List[str]:
        """
        Generate clinical recommendations based on assessment.
        
        Args:
            diagnosis: PCOS diagnosis result
            phenotype: PCOS phenotype if diagnosed
            risk_score: Overall risk score
        
        Returns:
            List of recommendations
        """
        recommendations = []
        
        if diagnosis == "PCOS":
            recommendations.append("PCOS diagnosis confirmed - consider comprehensive metabolic workup")
            
            if phenotype:
                phenotype_data = self.phenotypes.get(phenotype, {})
                severity = phenotype_data.get('severity', 'unknown')
                metabolic_risk = phenotype_data.get('metabolic_risk', 'unknown')
                
                if severity == "severe":
                    recommendations.append("Severe phenotype - consider aggressive lifestyle intervention and possible metformin therapy")
                
                if metabolic_risk == "high":
                    recommendations.append("High metabolic risk - screen for insulin resistance, diabetes, and cardiovascular risk factors")
            
            recommendations.append("Prescribe personalized low-GI, high-protein nutrition plan")
            recommendations.append("Recommend 150 minutes/week moderate-intensity exercise")
            recommendations.append("Consider inositol supplementation (4g/day) for insulin sensitivity")
            recommendations.append("Monitor weight - 5-10% reduction can restore ovulation")
        
        else:
            if risk_score > 40:
                recommendations.append("PCOS not confirmed, but moderate risk factors present")
                recommendations.append("Consider repeating assessment in 6 months if symptoms persist")
                recommendations.append("Lifestyle modifications still beneficial for symptom management")
            else:
                recommendations.append("Low probability of PCOS based on current criteria")
                recommendations.append("Consider other differential diagnoses for presented symptoms")
        
        return recommendations
