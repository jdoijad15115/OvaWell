"""
PDF Report Generator for meal plans and assessments.
Creates professional PDF documents for patients.
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
from typing import Dict, List
import os


class PDFGenerator:
    def __init__(self):
        """Initialize PDF generator with styles."""
        self.styles = getSampleStyleSheet()
        
        # Custom styles for women's health theme
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#FF8FA3'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#FF8FA3'),
            spaceAfter=12
        )
        
        self.body_style = ParagraphStyle(
            'CustomBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            textColor=colors.HexColor('#4A4A4A')
        )
    
    def generate_meal_plan_pdf(
        self,
        patient_name: str,
        meal_plan: Dict,
        shopping_list: Dict,
        assessment: Dict,
        output_path: str,
        city: str
    ) -> str:
        """
        Generate comprehensive PDF meal plan report.
        
        Args:
            patient_name: Patient's name
            meal_plan: Weekly meal plan data
            shopping_list: Shopping list with categories
            assessment: PCOS assessment results
            output_path: Path to save PDF
            city: Patient's city
        
        Returns:
            Path to generated PDF file
        """
        
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        # Header
        title = Paragraph("OvaWell PCOS Meal Plan", self.title_style)
        story.append(title)
        story.append(Spacer(1, 0.2 * inch))
        
        # Patient Info
        patient_info = f"""
        <b>Patient:</b> {patient_name}<br/>
        <b>Location:</b> {city}<br/>
        <b>Generated:</b> {datetime.now().strftime('%B %d, %Y')}<br/>
        <b>PCOS Risk Level:</b> {assessment.get('risk_level', 'N/A')}<br/>
        <b>Phenotype:</b> {assessment.get('phenotype', 'N/A')}
        """
        story.append(Paragraph(patient_info, self.body_style))
        story.append(Spacer(1, 0.3 * inch))
        
        # Assessment Summary
        story.append(Paragraph("PCOS Assessment Summary", self.heading_style))
        
        criteria_met = assessment.get('criteria_met', [])
        criteria_text = f"<b>Rotterdam Score:</b> {assessment.get('rotterdam_score', 'N/A')}<br/>"
        criteria_text += f"<b>Criteria Met:</b> {', '.join(criteria_met) if criteria_met else 'None'}<br/>"
        
        story.append(Paragraph(criteria_text, self.body_style))
        story.append(Spacer(1, 0.3 * inch))
        
        # Nutrition Guidelines
        story.append(Paragraph("Your PCOS Nutrition Plan", self.heading_style))
        
        guidelines_text = """
        This personalized meal plan is designed to help manage PCOS symptoms through nutrition:<br/>
        • <b>40% Carbohydrates</b> - Low glycemic index only<br/>
        • <b>30% Protein</b> - Supports insulin sensitivity<br/>
        • <b>30% Healthy Fats</b> - Anti-inflammatory omega-3s<br/>
        <br/>
        <b>Key Benefits:</b><br/>
        • Improves insulin sensitivity<br/>
        • Reduces inflammation<br/>
        • Supports hormone balance<br/>
        • Aids in weight management<br/>
        """
        story.append(Paragraph(guidelines_text, self.body_style))
        story.append(Spacer(1, 0.3 * inch))
        
        # Sample Week Meal Plan
        story.append(Paragraph("Week 1 Meal Plan", self.heading_style))
        
        # Create meal plan table
        meal_data = [['Day', 'Breakfast', 'Lunch', 'Dinner', 'Snack']]
        
        for day in range(1, 8):
            day_key = f"Day {day}"
            if day_key in meal_plan:
                day_meals = meal_plan[day_key]
                row = [
                    f"Day {day}",
                    day_meals.get('breakfast', {}).get('title', 'N/A')[:30],
                    day_meals.get('lunch', {}).get('title', 'N/A')[:30],
                    day_meals.get('dinner', {}).get('title', 'N/A')[:30],
                    day_meals.get('snack', {}).get('title', 'N/A')[:30]
                ]
                meal_data.append(row)
        
        meal_table = Table(meal_data, colWidths=[0.8*inch, 2*inch, 2*inch, 2*inch, 1.5*inch])
        meal_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FFB3C1')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FFF5F7')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#FFE4E8'))
        ]))
        
        story.append(meal_table)
        story.append(Spacer(1, 0.3 * inch))
        
        # Shopping List
        story.append(Paragraph(f"Shopping List ({city})", self.heading_style))
        
        for category, items in shopping_list.get('categories', {}).items():
            story.append(Paragraph(f"<b>{category}</b>", self.body_style))
            
            for item in items[:5]:  # Limit to 5 items per category for space
                item_text = f"• {item.get('item', 'N/A')} - {item.get('quantity', '')} " + \
                           f"({item.get('where', 'Local stores')})"
                story.append(Paragraph(item_text, self.body_style))
            
            story.append(Spacer(1, 0.15 * inch))
        
        # Estimated Cost
        if 'total_estimated_cost' in shopping_list:
            cost_text = f"<b>Estimated Weekly Cost:</b> {shopping_list['total_estimated_cost']}"
            story.append(Paragraph(cost_text, self.body_style))
        
        story.append(Spacer(1, 0.3 * inch))
        
        # Tips
        story.append(Paragraph("Shopping Tips", self.heading_style))
        
        tips = shopping_list.get('shopping_tips', [])
        for tip in tips[:5]:
            story.append(Paragraph(f"• {tip}", self.body_style))
            story.append(Spacer(1, 0.1 * inch))
        
        # Disclaimer
        story.append(Spacer(1, 0.5 * inch))
        disclaimer = """
        <b>Medical Disclaimer:</b> This meal plan is designed to complement medical treatment for PCOS, 
        not replace it. Always consult with your healthcare provider before making significant dietary changes. 
        Individual needs may vary based on medications, comorbidities, and personal health goals.
        """
        story.append(Paragraph(disclaimer, ParagraphStyle(
            'Disclaimer',
            parent=self.body_style,
            fontSize=9,
            textColor=colors.HexColor('#8E8E8E'),
            leftIndent=20,
            rightIndent=20
        )))
        
        # Build PDF
        doc.build(story)
        
        return output_path
    
    def generate_assessment_pdf(
        self,
        patient_name: str,
        assessment_results: Dict,
        output_path: str
    ) -> str:
        """
        Generate PCOS assessment report PDF.
        
        Args:
            patient_name: Patient's name
            assessment_results: Complete assessment data
            output_path: Path to save PDF
        
        Returns:
            Path to generated PDF file
        """
        
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        # Title
        title = Paragraph("PCOS Assessment Report", self.title_style)
        story.append(title)
        story.append(Spacer(1, 0.2 * inch))
        
        # Patient Info
        info_text = f"""
        <b>Patient:</b> {patient_name}<br/>
        <b>Assessment Date:</b> {datetime.now().strftime('%B %d, %Y')}<br/>
        <b>Risk Level:</b> {assessment_results.get('risk_level', 'N/A')}<br/>
        <b>Confidence:</b> {assessment_results.get('confidence_percent', 'N/A')}%
        """
        story.append(Paragraph(info_text, self.body_style))
        story.append(Spacer(1, 0.3 * inch))
        
        # Rotterdam Criteria
        story.append(Paragraph("Rotterdam Criteria Evaluation", self.heading_style))
        
        rotterdam = f"<b>Score:</b> {assessment_results.get('rotterdam_score', 'N/A')}<br/>"
        criteria_met = assessment_results.get('criteria_met', [])
        rotterdam += f"<b>Criteria Met:</b> {', '.join(criteria_met) if criteria_met else 'None'}<br/>"
        
        story.append(Paragraph(rotterdam, self.body_style))
        story.append(Spacer(1, 0.2 * inch))
        
        # Evidence
        story.append(Paragraph("Clinical Evidence", self.heading_style))
        
        evidence = assessment_results.get('evidence', {})
        for criterion, explanation in evidence.items():
            story.append(Paragraph(f"<b>{criterion.replace('_', ' ').title()}:</b> {explanation}", self.body_style))
            story.append(Spacer(1, 0.1 * inch))
        
        story.append(Spacer(1, 0.3 * inch))
        
        # Recommendations
        story.append(Paragraph("Clinical Recommendations", self.heading_style))
        
        recommendations = assessment_results.get('recommendations', [])
        for i, rec in enumerate(recommendations, 1):
            story.append(Paragraph(f"{i}. {rec}", self.body_style))
            story.append(Spacer(1, 0.1 * inch))
        
        # Build PDF
        doc.build(story)
        
        return output_path
