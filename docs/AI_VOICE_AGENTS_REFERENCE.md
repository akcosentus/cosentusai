# AI Voice Agents Reference Guide

**Document Type:** Technical Reference  
**Last Updated:** February 2026  
**Purpose:** Comprehensive reference for Cosentus AI voice agents, optimized for retrieval systems  
**Scope:** 8 specialized AI voice agents for healthcare revenue cycle management

---

## Overview

Cosentus AI provides 8 specialized voice agents designed for healthcare revenue cycle management. Each agent handles specific tasks in patient billing, insurance processing, and customer service. All agents are powered by Retell AI technology and support multilingual communication.

**Core Capabilities Across All Agents:**
- Natural language conversation processing
- Real-time voice interaction
- Integration with healthcare systems
- HIPAA-compliant communication
- Multilingual support (varies by agent)

---

## All Agents Quick Reference

**Complete list of all 8 Cosentus AI voice agents with primary functions:**

### 1. Cindy - Payment & Balance Specialist
Handles patient outstanding balances and payment processing in 50+ languages. Can manage 20+ simultaneous calls. Processes credit card payments securely, explains insurance coverage, and provides real-time balance inquiries. Best for: high-volume multilingual payment collection, balance explanations, payment plan setup.

### 2. Chris - Insurance Claim Specialist
Makes outbound calls to insurance companies for claim follow-up and denial resolution. Navigates complex insurance phone systems to check claim statuses, investigate denials, gather missing documentation, and track timely filing deadlines. Best for: claim follow-up, denial investigation, insurance carrier communication.

### 3. Emily - Pre-Service Anesthesia Cost Estimates
Provides pre-surgery anesthesia cost estimates for patients. Handles insured, self-pay, and cosmetic surgery cases. Applies facility-specific pricing rules and explains payment plans and financial assistance options. Best for: surgical cost transparency, pre-operative financial planning.

### 4. Sarah - Medical Appointment Scheduling
Manages medical appointments for both inbound patient requests and outbound scheduling calls. Integrates with calendar systems in real-time, verifies insurance, manages referrals, and handles rescheduling. Best for: appointment management, calendar coordination, scheduling automation.

### 5. Allison - Customer Service Agent
General-purpose customer service agent for patient inquiries. Handles billing questions, appointment assistance, practice information, and after-hours support. Provides professional, caring assistance with versatile knowledge base. Best for: after-hours coverage, general inquiries, call overflow.

### 6. Harper - Eligibility & Benefits Verification
Calls insurance companies to verify patient coverage before services. Checks eligibility, benefits, deductibles, copays, in-network status, and coordinates secondary insurance. Best for: pre-service insurance verification, preventing claim denials, coverage validation.

### 7. Olivia - Prior Authorization Follow-Up
Tracks prior authorization approvals by calling insurance companies. Monitors authorization status (approved, denied, pending), expedites urgent cases, documents denial reasons, and tracks authorization numbers and validity periods. Best for: authorization tracking, urgent case expediting, pre-procedure verification.

### 8. Michael - Payment Reconciliation
Investigates and resolves payment discrepancies with insurance companies. Tracks down missing payments, resolves partial or incorrect payments, traces lost checks, retrieves EOBs, and manages overpayments. Best for: payment recovery, financial reconciliation, discrepancy resolution.

**Revenue Cycle Coverage:** Pre-service (Harper, Olivia, Emily, Sarah), Service Delivery (Sarah, Allison), Post-service (Chris, Michael, Cindy, Allison)

**Call Direction Summary:** Inbound (Cindy, Allison, Emily, Sarah), Outbound (Chris, Harper, Olivia, Michael, Sarah)

---

## Agent 1: Cindy - Payment & Balance Specialist

**Agent ID:** cindy  
**Specialization:** Payment Processing and Balance Management  
**Primary Function:** Handles patient outstanding balances and payment processing  
**Languages Supported:** 50+ languages  
**Concurrency:** Can handle 20+ simultaneous calls

### Full Description
Cindy is a multilingual payment specialist who assists patients in understanding their outstanding medical balances and available payment options. She provides clear, empathetic assistance while processing payments and explaining billing details. Cindy excels at breaking down complex billing statements into understandable information.

### Core Capabilities
- **Real-time balance inquiries:** Instant access to patient account balances and payment history
- **Secure payment processing:** PCI-compliant credit card transaction handling
- **Service-based breakdown:** Itemized balance breakdown organized by date of service
- **Insurance explanations:** Clear explanations of insurance coverage and patient responsibility

### Use Cases
- Patient calls asking about their bill
- Payment plan setup and management
- Balance verification before appointments
- Multi-language patient support
- High-volume payment processing during billing cycles

### Keywords
payment processing, patient balance, medical billing, multilingual support, credit card processing, insurance explanation, balance inquiry, payment history, patient accounts, healthcare payments

---

## Agent 2: Chris - Insurance Claim Specialist

**Agent ID:** chris  
**Specialization:** Insurance Claim Follow-up  
**Primary Function:** Outbound insurance carrier communication for claim resolution  
**Call Type:** Primarily outbound to insurance companies

### Full Description
Chris specializes in making outbound calls to insurance companies to follow up on claim statuses, investigate denials, and gather required documentation for billing. He is trained to navigate complex insurance phone systems, speak professionally with insurance representatives, and extract critical information needed for claim resolution.

### Core Capabilities
- **Outbound claim follow-ups:** Proactive calls to insurance carriers for claim status updates
- **Denial investigation:** Detailed analysis and documentation of claim denial reasons
- **Documentation requests:** Identification and retrieval of missing information for claims
- **Deadline tracking:** Monitoring and management of timely filing deadlines

### Use Cases
- Following up on pending insurance claims
- Investigating why claims were denied
- Gathering information for claim resubmission
- Tracking authorization requirements
- Managing timely filing deadlines

### Keywords
insurance claims, claim follow-up, denial resolution, insurance carriers, claim status, outbound calls, claim resubmission, timely filing, denial investigation, insurance communication

---

## Agent 3: Emily - Pre-Service Anesthesia Cost Estimates

**Agent ID:** emily  
**Specialization:** Anesthesia Cost Estimation  
**Primary Function:** Pre-surgery anesthesia cost estimates for patients  
**Patient Types Supported:** Insured, self-pay, cosmetic surgery

### Full Description
Emily helps patients understand their expected anesthesia costs before scheduled surgeries. She gathers procedure details, applies facility-specific pricing rules, and provides transparent cost estimates. Emily can handle various patient types including those with insurance, self-pay patients, and cosmetic surgery cases, each with different pricing structures.

### Core Capabilities
- **Pre-surgery cost estimates:** Accurate anesthesia cost projections before procedures
- **Insurance vs. self-pay pricing:** Different calculation methods based on payment type
- **Facility-specific rates:** Application of correct pricing based on location and facility
- **Financial assistance:** Information about payment plans and assistance programs

### Use Cases
- Pre-operative consultations
- Financial planning for scheduled surgeries
- Self-pay patient cost estimation
- Cosmetic procedure pricing
- Insurance vs. cash pay comparisons

### Keywords
anesthesia costs, pre-surgery estimates, cost estimation, surgical pricing, self-pay patients, insurance pricing, facility rates, financial planning, cosmetic surgery, payment plans

---

## Agent 4: Sarah - Medical Appointment Scheduling

**Agent ID:** sarah  
**Specialization:** Appointment Management  
**Primary Function:** Medical appointment scheduling for practices and patients  
**Call Type:** Both inbound and outbound

### Full Description
Sarah manages appointment scheduling for medical practices, handling both inbound patient calls and outbound scheduling calls. She coordinates with calendar systems in real-time, confirms patient information, manages insurance verification, and efficiently handles appointment changes and cancellations.

### Core Capabilities
- **Bidirectional scheduling:** Handles both incoming patient requests and outbound booking calls
- **Real-time calendar integration:** Live availability checks and booking confirmations
- **Insurance verification:** Pre-appointment insurance status checks
- **Automated management:** Reminder calls and rescheduling coordination

### Use Cases
- New patient appointment booking
- Follow-up appointment scheduling
- Appointment reminders and confirmations
- Rescheduling and cancellations
- Referral appointment coordination

### Keywords
appointment scheduling, medical appointments, calendar management, patient booking, appointment reminders, rescheduling, insurance verification, referral management, inbound calls, outbound calls

---

## Agent 5: Allison - Customer Service Agent

**Agent ID:** allison  
**Specialization:** General Customer Service  
**Primary Function:** General customer inquiries and support  
**Coverage:** After-hours and overflow support

### Full Description
Allison is a versatile customer service agent trained to handle general patient inquiries with professionalism and care. She provides information about billing, appointments, practice details, and directs patients to appropriate resources. Allison excels at after-hours support when live staff is unavailable.

### Core Capabilities
- **General billing support:** Basic billing questions and account information
- **Appointment assistance:** Scheduling help and appointment information
- **Practice information:** Directions, hours, provider information
- **After-hours coverage:** Patient support outside regular business hours

### Use Cases
- After-hours patient calls
- General practice information requests
- Overflow call handling during high-volume periods
- Basic billing and appointment questions
- Triage and routing to appropriate departments

### Keywords
customer service, general inquiries, after-hours support, patient assistance, practice information, call overflow, general billing, appointment help, patient care, healthcare customer service

---

## Agent 6: Harper - Eligibility & Benefits Verification

**Agent ID:** harper  
**Specialization:** Insurance Eligibility Verification  
**Primary Function:** Pre-service insurance coverage verification  
**Call Type:** Outbound to insurance companies

### Full Description
Harper specializes in calling insurance companies to verify patient coverage before medical services are rendered. She checks eligibility status, available benefits, deductible amounts, and in-network status to ensure accurate billing and prevent claim denials. Harper's verification helps practices understand patient financial responsibility upfront.

### Core Capabilities
- **Real-time eligibility checks:** Live verification with insurance carriers
- **Benefits verification:** Detailed coverage, deductibles, and copay information
- **Network status:** In-network vs. out-of-network provider status verification
- **Secondary insurance:** Coordination of benefits for multiple insurance policies

### Use Cases
- Pre-appointment insurance verification
- New patient intake processing
- Scheduled procedure authorization
- Secondary insurance coordination
- Coverage limit verification

### Keywords
insurance eligibility, benefits verification, coverage verification, deductible information, insurance coordination, in-network status, pre-service verification, insurance carriers, coordination of benefits, patient coverage

---

## Agent 7: Olivia - Prior Authorization Follow-Up

**Agent ID:** olivia  
**Specialization:** Prior Authorization Tracking  
**Primary Function:** Authorization approval tracking and expediting  
**Call Type:** Outbound to insurance companies

### Full Description
Olivia specializes in calling insurance companies to track prior authorization approvals for medical procedures. She monitors authorization status (approved, denied, or pending), documents denial reasons, and expedites urgent cases to keep procedures on schedule. Olivia ensures practices have proper authorization before performing services.

### Core Capabilities
- **Authorization tracking:** Real-time status checks on prior authorization requests
- **Expedited reviews:** Rush processing requests for urgent medical procedures
- **Denial documentation:** Detailed recording of denial reasons for appeals
- **Authorization management:** Tracking authorization numbers and validity periods

### Use Cases
- Pre-procedure authorization verification
- Urgent case expediting
- Authorization denial follow-up
- Authorization number retrieval
- Validity period tracking

### Keywords
prior authorization, authorization tracking, insurance authorization, expedited reviews, authorization approval, denial appeals, urgent cases, authorization status, insurance approval, pre-procedure authorization

---

## Agent 8: Michael - Payment Reconciliation

**Agent ID:** michael  
**Specialization:** Payment Reconciliation and Recovery  
**Primary Function:** Payment discrepancy investigation and resolution  
**Call Type:** Outbound to insurance companies

### Full Description
Michael acts as a financial detective, specializing in tracking down and resolving payment discrepancies with insurance companies. He investigates missing payments, partial payments, incorrect payment amounts, and overpayments to ensure complete and accurate payment reconciliation. Michael ensures every dollar owed to the practice is properly accounted for.

### Core Capabilities
- **Missing payment investigation:** Tracking and recovering payments that should have been received
- **Discrepancy resolution:** Resolving differences between expected and received payments
- **Check tracing:** Following up on lost or undelivered payment checks
- **EOB retrieval:** Obtaining Explanation of Benefits documents and managing overpayment refunds

### Use Cases
- Missing payment recovery
- Partial payment investigation
- Incorrect payment amount disputes
- Lost check replacement
- Overpayment identification and refund processing

### Keywords
payment reconciliation, payment discrepancy, missing payments, payment recovery, insurance payments, check trace, payment investigation, EOB retrieval, overpayment, financial reconciliation

---

## Quick Reference Comparison

| Agent Name | Primary Role | Call Direction | Key Strength | Best For |
|------------|-------------|----------------|--------------|----------|
| **Cindy** | Payment Processing | Inbound | 50+ languages, 20+ concurrent calls | High-volume multilingual payment support |
| **Chris** | Insurance Claims | Outbound | Denial investigation and resolution | Claim follow-up and denial management |
| **Emily** | Anesthesia Estimates | Inbound | Pre-surgery cost transparency | Surgical cost estimation |
| **Sarah** | Appointment Scheduling | Both | Real-time calendar integration | Scheduling and appointment management |
| **Allison** | Customer Service | Inbound | General versatility | After-hours and overflow support |
| **Harper** | Eligibility Verification | Outbound | Pre-service verification | Insurance eligibility checks |
| **Olivia** | Prior Authorization | Outbound | Expedited urgent cases | Authorization tracking |
| **Michael** | Payment Reconciliation | Outbound | Financial investigation | Payment discrepancy resolution |

---

## Use Case Matrix

### Revenue Cycle Stage Mapping

**Pre-Service (Before Care Delivery):**
- Harper: Insurance eligibility verification
- Olivia: Prior authorization tracking
- Emily: Cost estimation for procedures
- Sarah: Appointment scheduling

**Service Delivery:**
- Sarah: Schedule management
- Allison: Patient inquiries during care

**Post-Service (After Care Delivery):**
- Chris: Claim submission follow-up
- Michael: Payment reconciliation
- Cindy: Patient balance collection
- Allison: General billing inquiries

### Problem-Solution Mapping

| Problem | Recommended Agent(s) |
|---------|---------------------|
| Patient doesn't understand their bill | Cindy, Allison |
| Insurance claim was denied | Chris |
| Need to verify patient insurance before appointment | Harper |
| Prior authorization status unknown | Olivia |
| Expected insurance payment not received | Michael |
| Patient needs surgery cost estimate | Emily |
| Calendar is overbooked with scheduling calls | Sarah |
| After-hours patient calls need coverage | Allison |

---

## Technical Integration

**Platform:** Retell AI  
**Access Method:** Web embeds and direct integration  
**Embed Versions:**
- `/embed/voice/all` - All agents showcase (v1)
- `/embed/voice/all-v2` - All agents showcase (v2, optimized)
- `/embed/voice/[agent]` - Individual agent pages

**Rate Limiting:** Client-side and server-side protection against abuse  
**Security:** HIPAA-compliant, secure voice transmission

---

## Keywords for Retrieval

healthcare AI, medical billing agents, revenue cycle management, insurance verification, payment processing, appointment scheduling, claim follow-up, prior authorization, payment reconciliation, patient service, multilingual support, healthcare automation, medical practice efficiency, billing assistance, insurance communication, patient balance, cost estimation, eligibility verification, denial management, financial reconciliation

---

**Document End**
