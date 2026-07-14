# Changelog — Founder Network Nurturer

## [0.1.0] — 2026-07-14

### Added
- Initial release (beta)
- Weekly Schedule trigger (Monday 08:00) + Manual Trigger
- 4-contact sample: peer, investor_adjacent, technical_advisor, competitor_friendly
- Deterministic urgency scoring: days_overdue × priority weight
- LLM at temperature 0.6: personalised 3–5 sentence drafts with ask/offer and why_now
- Skip list for contacts not yet due
- Weekly networking goal statement
- Draft review approval gate — workflow NEVER sends messages directly
- Rejection → discard logging
- No auto-send design (explicit constraint)

### Known issues at release
- Not runtime-tested
- Contact data requires manual maintenance — integrate with CRM for production
- No news peg automation — current_news requires manual entry
- No "last contact" update on approval — manually update contact records after sending
