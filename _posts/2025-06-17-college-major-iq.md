---
layout: post
title: "Accurate IQ Estimates By College Major"
date: 2025-06-17 
permalink: /college-major-iq/
categories: 
---
There is this widely circulated chart claiming to show the average IQ of students by college major, citing the Educational Testing Service (ETS) as its source. 
<div style="text-align: center;">
    <figure>
        <img src="/assets/images/statistic-brain-college-major-iq.jpg" width="200" alt="Alt Text">
    </figure>
</div>
The original data comes from [Statistic Brain][statbrain], which estimates IQ using GRE scores from 2006. While the data itself is plausibly accurate—[matching other records of GRE scores by major](http://www.kyoolee.net/gre_2005-6_score_chart_and_philosophy_majors.pdf)—the methodology for converting GRE scores to IQ contains two critical errors: 

1. **Incorrect Standard Deviation Assumption**: The original analysis assumes that a standard deviation on the GRE corresponds to 22 IQ points, which not only ignores [regression toward the mean](https://en.wikipedia.org/wiki/Regression_toward_the_mean), but assumes the *opposite*, yielding estimates that are more extreme than reality.
2. **Overestimated Mean IQ**: The analysis assumes GRE test-takers have an average IQ of 115. This is likely too high; a mean of 112 (consistent with Master’s degree holders) is more plausible. 

## A Better Estimation Method

To correct this, I estimate IQ by major using the following assumptions:
1. **GRE-IQ correlation**: 0.7 (based on typical correlations between IQ and standardized tests)
2. **Mean IQ of GRE test-takers**: 112 (consistent with [estimates for Master's degree holders][rc-analysis]).
3. **IQ standard deviation for GRE test-takers**: 12 (slighly higher than the [observed variance][rc-analysis] found for Master's degree holders).
4. **Quant-Verbal correlation**: 0.35 (per [ETS data](https://www.ets.org/pdfs/gre/gre-guide-table-1a.pdf)).

I also account for: 
- **Ceiling effects**: Some majors (e.g., Mathematical Sciences) have many test-takers achieve the maximum score on some GRE sections, lowering the estimate of their IQs
- **Floor effects**: Other majors (e.g. Early Childhood Education) have many test-takers achieve scores that are lower than should be achievable by chance.

## Results

| Major                                                  | IQ  |
|--------------------------------------------------------|-----|
| Mathematical Sciences                                  | 119 |
| Physics & Astronomy                                    | 118 |
| Economics                                              | 118 |
| Materials Engineering                                  | 117 |
| Philosophy                                             | 117 |
| Banking & Finance                                      | 117 |
| Chemical Engineering                                   | 116 |
| Engineering — Other                                    | 116 |
| Physical Sciences                                      | 116 |
| Computer & Information Sciences                        | 115 |
| Political Science                                      | 115 |
| Engineering                                            | 115 |
| Electrical & Electronics Engineering                   | 114 |
| Humanities & Arts, Other                               | 114 |
| Chemistry                                              | 114 |
| Mechanical Engineering                                 | 114 |
| Arts — History, Theory, & Criticism                    | 114 |
| Law                                                    | 114 |
| Foreign Languages & Literatures                        | 114 |
| Industrial Engineering                                 | 114 |
| Religion & Theology                                    | 113 |
| Earth, Atmospheric, & Marine Sciences                  | 113 |
| Business                                               | 113 |
| Humanities & Arts                                      | 113 |
| Business, Other                                        | 113 |
| Business Admin & Management                            | 113 |
| Civil Engineering                                      | 113 |
| Library & Archival Sciences                            | 112 |
| Biological & Biomedical Sciences                       | 112 |
| English Language & Literature                          | 112 |
| Accounting                                             | 112 |
| History                                                | 112 |
| Social & Behavioral Sciences                           | 112 |
| Architecture & Environmental Design                    | 112 |
| Arts — Performance & Studio                            | 112 |
| Education - Secondary                                  | 111 |
| Anthropology & Archaeology                             | 111 |
| Public Administration                                  | 111 |
| Sociology                                              | 111 |
| Education, Other                                       | 110 |
| Agriculture, Natural Res. & Conservation               | 110 |
| Communcations & Journalism                             | 110 |
| Education - Higher                                     | 109 |
| Social & Behavioral Sciences, Other                    | 109 |
| Life Sciences                                          | 109 |
| Psychology                                             | 109 |
| Natural Sciences — Other                               | 109 |
| Health & Medical Sciences                              | 108 |
| Education - Curriculum & Instruction                   | 108 |
| Education - Evaluation & Research                      | 108 |
| Education - Administration                             | 108 |
| Education                                              | 108 |
| Family & Consumer Sciences                             | 107 |
| Education - Elementary                                 | 106 |
| Education - Student Counseling & Personnel Services    | 105 |
| Social Work                                            | 105 |
| Education - Special                                    | 104 |
| Education - Early Childhood                            | 103 |


## Notes on Data Sources
The Statistic Brain article erroneously refers to "SAT" scores, but the categories and values align with GRE data. The 2006 GRE scores are consistent with [historical ETS reports](https://nces.ed.gov/programs/digest/d13/tables/dt13_327.10.asp), so the raw data is likely reliable—only the IQ conversion is problematic.

[statbrain]: https://web.archive.org/web/20120117212741/http://www.statisticbrain.com/iq-estimates-by-intended-college-major/
[rc-analysis]: https://randomcriticalanalysis.com/2015/06/11/iq-test-scores-gpa-income-and-related-correlations-from-nlsy97/#rcatoc-iq-test-score-by-educational-attainment-level

