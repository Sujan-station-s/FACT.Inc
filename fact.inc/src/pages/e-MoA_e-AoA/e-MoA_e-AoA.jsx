
import React, { useState, useEffect, useRef } from "react";
import CardLayout from "../../components/PageCard/PageCard";
import { useCompanyType } from "../../contexts/CompanyTypeContext";
import { useNavigate } from "react-router-dom";
import "./e-MoA_e-AoA.css";
import eMoAPDF from "../../assets/pdfs/e-MOA.pdf";
import eAoAPDF from "../../assets/pdfs/e-AOA.pdf";
import eAoAPDF_H from "../../assets/pdfs/AOA H part.pdf";
import MoaClauseDisplay from "./MoaClauseDisplay";
import { useAuth } from '../../contexts/AuthContext';



const sampleFormData = {
  table: "F",
  companyName: "KRYON TECHNOLOGY PRIVATE LIMITED",
};
const toInitCap = (str) =>
  str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const sampleAoaData = [
  {
    part: "I",
    article: "",
    section: "Interpretation",
    description: `In these regulations the Act means the Companies Act 2013, the seal means the common seal of the company. The Company means ${toInitCap(
      sampleFormData.companyName
    )}. Unless the context otherwise requires, words or expressions contained in these regulations shall bear the same meaning as in the Act or any statutory modification thereof in force at the date at which these regulations become binding on the company.\n\nIn these Articles:\n(a) The Act means the Companies Act 2013\n(b) Board means in relation to a Company, the collective body of the directors\n(c) The Company means ${toInitCap(
      sampleFormData.companyName
    )}\n\nPRIVATE COMPANY: The Company is a Private Company within the meaning of Section 2(68) of the Companies Act 2013 having a minimum paid-up share capital as may be prescribed and accordingly:\ni. restricts the right to transfer its shares,\nii. except in the case of One Person Company, limits the number of its members to two hundred (provided that where two or more persons hold one or more shares in a company jointly they shall be treated as a single member),\niii. prohibits any invitation to the public to subscribe for any securities of the company.\n\nWherever the provisions of the Companies Act 2013 require the authority of the Articles of Association, this Article shall be deemed to have granted such authority to the Company and to the Board to carry out an activity as contemplated under the Act.\n\nTo clarify and as an illustration this Article is deemed to have authorized:\na) To pay commission on issue of shares and debentures pursuant to Section 40 of the Companies Act 2013\nb) To buyback by the Company its own securities pursuant to Sections 68 to 70 of the Companies Act 2013\nc) To issue redeemable preference shares pursuant to Section 55 of the Companies Act 2013\nd) To accept unpaid share capital although not called up pursuant to Section 50 of the Companies Act 2013\ne) To alter the share capital of the Company pursuant to Section 61 of the Companies Act 2013\nf) To alter the rights of holders of special class of shares pursuant to Section 48(1) the Companies Act 2013\ng) To appoint additional directors, alternate director and nominee directors pursuant to Section 161 of the Companies Act 2013 or such similar provisions\nh) To issue Bonus shares pursuant to section 63 of the Companies Act 2013\ni) A further issue of shares may be made in any manner whatsoever as the Board may determine including by way of preferential offer or private placement subject to and in accordance with Section 42, Section 62 the Companies Act 2013 and the Rules.`,
  },
  {
    part: "II",
    article: "1",
    section: "Share Capital and Variation of rights",
    description: `The Authorized Share Capital of the Company shall be as contained in the 5th Clause of the Memorandum of Association of the Company as may be amended from time to time by the Company in accordance with the provisions of the Companies Act 2013.Subject to the provisions of the Act and these Articles the shares in the capital of the company shall be under the control of the Directors who may issue allot or otherwise dispose of the same or any of them to such persons in such proportion and on such terms and conditions and either at a premium or at par and at such time as they ma y from time to time think fit.`,
  },
  {
    part: "II",
    article: "2",
    section: "Share Capital and Variation of rights",
    description:
      "Subject to the provision of the Companies Act 2013 and these articles the Company has power to issue shares of different class Compulsory and Partly Convertible Preference Shares Redeemable Preference Shares Redeemable Debentures Convertible Debentures and shares under Employee Stock Option Scheme and other securities as may be permitted under the applicable laws from time to time. E very person whose name is entered as a member in the register of members shall be entitled to receive within two months after incorporation in case of subscribers to the memorandum or after allotment or within one month after the application for the registration of transfer or transmission or within such other period as the conditions of issue shall be provided one certificate for all his shares without payment of any charges or several certificate search for one or more of his shares upon payment of twenty rupees for each certificate after the first. E very certificate shall be under the seal and shall specify the shares to which it relates and the amount paid - up thereon. In respect of any share or shares held jointly by several persons the company shall not be bound to issue more than one certificate and delivery of a certificate for a share to one of several joint holders shall be sufficient delivery to all such holders.",
  },
  {
    part: "II",
    article: "3",
    section: "Share Capital and Variation of rights",
    description:
      "If any share certificate be worn out defaced mutilated or torn or if there be no further space on the back for endorsement of transfer then upon production and surrender thereof to the company a new certificate ma y be issued in lieu thereof and if any certificate is lost or destroyed then upon proof thereof to the satisfaction of the company and on execution of such indemnity as the company deem adequate a new certificate in lieu thereof shall be given. E very certificate under this Article shall be issued on payment of twenty rupees for each certificate. The provisions of Articles(2) and(3) shall mutatis mutandis apply to debentures of the company.",
  },
  {
    part: "II",
    article: "4",
    section: "Share Capital and Variation of rights",
    description:
      "Except as required by law no person shall be recognized by the company as holding any share upon any trust and the company shall not be bound by or be compelled in any way to recognize (even when having notice thereof ) any equitable contingent future or partial interest in any share or any interest in any fractional part of a share or (except only as by these regulations or by law otherwise provided) any other rights in respect of any share except an absolute right to the entirety thereof in the registered holder.",
  },
  {
    part: "II",
    article: "5",
    section: "Share Capital and Variation of rights",
    description:
      "The company may exercise the powers of paying commissions conferred by sub-section (6) of section 40 provided that the rate per cent or the amount of the commission paid or agreed to be paid shall be disclosed in the manner required by that section and rules made thereunder. The rate or amount of the commission shall not exceed the rate or amount prescribed in rules made under sub-section (6) of section 40. The commission may be satisfied by the payment of cash or the allotment of fully or partly paid shares or partly in the one way and partly in the other.",
  },
  {
    part: "II",
    article: "6",
    section: "Share Capital and Variation of rights",
    description:
      "If at any time the share capital is divided into different classes of shares the rights attached to any class (unless otherwise provided by the terms of issue of the shares of that class) may subject to the provisions of section 48 and whether or not the company is being wound up be varied with the consent in writing of the holders of three-fourths of the issued shares of that class or with the sanction of a special resolution passed at a separate meeting of the holders of the shares of that class. To e very such separate meeting the provisions of these regulations relating to general meetings shall mutatis mutandis apply but so that the necessary quorum shall be at least two persons holding at least one-third of the issued shares of the class in question.",
  },
  {
    part: "II",
    article: "7",
    section: "Share Capital and Variation of rights",
    description:
      "The rights conferred upon the holders of the shares of any class issued with preferred or other rights shall not unless otherwise expressly provided by the terms of issue of the shares of that class be deemed to be varied by the creation or issue of further shares ranking par pass therewith.",
  },
  {
    part: "II",
    article: "8",
    section: "Share Capital and Variation of rights",
    description:
      "Any preference shares may with the sanction of a special resolution be issued on the terms that they are to be redeemed on such terms and in",
  },
  {
    part: "II",
    article: "9",
    section: "Lien",
    description:
      "The company shall have a first and paramount lie non e very share (not being a fully paid share) for all monies (whether presently payable or not) called or payable at a fixed time in respect of that share and on all shares (not being fully paid shares) standing registered in the name of a single person for all monies presently payable by him or his estate to the company Provided that the Board of directors may at any time declare any share to be wholly or in part exempt from the provisions of this clause. The company's lien if any on a share shall extend to all dividends payable and bonuses declared from time to time in respect of such shares.",
  },
  {
    part: "II",
    article: "10",
    section: "Lien",
    description:
      "The company may sell in such manner as the Board thinks fit any shares on which the company has a lien Provided that no sale shall be made unless a sum in respect of which the lien exists is presently payable or b until the expiration of fourteen days after a notice in writing stating and demanding payment of such part of the amount in respect of which the lien exists as is presently payable has been given to the registered holder for the time being of the share or the person entitled thereto by reason of his death or insolvency.",
  },
  {
    part: "II",
    article: "11",
    section: "Lien",
    description:
      "To give effect to any such sale the Board may authorize some person to transfer the shares sold to the purchaser thereof The purchaser shall be registered as the holder of the shares comprised in any such transfer. The purchaser shall not be bound to see to the application of the purchase money nor shall his title to the shares be affected by any irregularity or invalidity in the proceedings in reference to the sale.",
  },
  {
    part: "II",
    article: "12",
    section: "Lien",
    description:
      "The proceeds of the sale shall be received by the company and applied in payment of such part of the amount in respect of which the lien exists as is presently payable. The residue if any shall subject to a like lien for sums not presently payable as existed upon the shares before the sale be paid to the person entitled to the shares at the date of the sale.",
  },
  {
    part: "II",
    article: "13",
    section: "Lien", // NOTE: Original data had this as "Lien", but it's about "Calls on shares". Kept as "Lien" to match source.
    description:
      "The Board may from time to time make calls upon the members in respect of any monies unpaid on their shares (whether on account of the nominal value of the shares or by way of premium) and not by the conditions of allotment thereof made payable at fixed times Provided that no call shall exceed one-fourth of the nominal value of the share or be payable at less than one month from the date fixed for the payment of the last preceding call. Each member shall subject to receiving at least fourteen days notice specifying the time or times and place of payment pay to the company at the time or times and place so specified the amount called on his shares. A call may be revoked or postponed at the discretion of the Board.",
  },
  {
    part: "II",
    article: "14",
    section: "Lien", // NOTE: "Calls on shares"
    description:
      "A call shall be deemed to have been made at the time when the resolution of the Board authorizing the call was passed and may be required to be paid by instalments.",
  },
  {
    part: "II",
    article: "15",
    section: "Lien", // NOTE: "Calls on shares"
    description:
      "The joint holders of a share shall be jointly and severally liable to pay all calls in respect thereof.",
  },
  {
    part: "II",
    article: "16",
    section: "Lien", // NOTE: "Calls on shares"
    description:
      "If a sum called in respect of a share is not paid before or on the day appointed for payment thereof the person from whom the sum is due shall pay interest thereon from the day appointed for payment thereof to the time of actual payment at ten per cent per annum or at such lower rate if any as the Board may determine. The Board shall be at liberty to waive payment of any such interest wholly or in part.",
  },
  {
    part: "II",
    article: "17",
    section: "Lien", // NOTE: "Calls on shares"
    description:
      "Any sum which by the terms of issue of a share becomes payable on allotment or at any fixed date whether on account of the nominal value of the share or by way of premium shall for the purposes of these regulations be deemed to be a call duly made and payable on the date on which by the terms of issue such sum becomes payable. In case of non-payment of such sum all the relevant provisions of these regulations as to payment of interest and expenses forfeiture or otherwise shall apply as if such sum had become payable by virtue of a call duly made and notified.",
  },
  {
    part: "II",
    article: "18",
    section: "Lien", // NOTE: "Calls on shares"
    description:
      "The Board - a. may if it thinks fit receive from any member willing to advance the same all or any part of the monies uncalled and unpaid upon any shares held by him and b. upon all or any of the monies so advanced may (until the same would but for such advance become presently payable) pay interest at such rate not exceeding unless the company in general meeting shall otherwise direct twelve per cent per annum as may be agreed upon between the Board and the member paying the sum in advance.",
  },
  {
    part: "II",
    article: "19",
    section: "Transfer of shares",
    description:
      "The instrument of transfer of any share in the company shall be executed by or on behalf of both the transferor and transferee. The transferor shall be deemed to remain a holder of the share until the name of the transferee is entered in the register of members in respect thereof.",
  },
  {
    part: "II",
    article: "20",
    section: "Transfer of shares",
    description:
      "The Board may subject to the right of appeal conferred by section 58 decline to register the transfer of a share not being a fully paid share to a person of whom they do not approve or any transfer of shares on which the company has a lien.",
  },
  {
    part: "II",
    article: "21",
    section: "Transfer of shares",
    description:
      "The Board may decline to recognize any instrument of transfer unless. the instrument of transfer is in the form as prescribed in rules made under sub-section (1) of section 56b. the instrument of transfer is accompanied by the certificate of the shares to which it relates and such other evidence as the Board may reasonably require to show the right of the transferor to make the transfer and c. the instrument of transfer is in respect of only one class of shares",
  },
  {
    part: "II",
    article: "22",
    section: "Transfer of shares",
    description:
      "On giving not less than seven days previous notice in accordance with section 91 and rules made thereunder the registration of transfers may be suspended at such times and for such periods as the Board may from time to time determine Provided that such registration shall not be suspended for more than thirty days at any one time or for more than forty-five days in the aggregate in any year",
  },
  {
    part: "II",
    article: "23",
    section: "Transmission of shares",
    description:
      "On the death of a member the survivor or survivors where the member was a joint holder and his nominee nominees or legal representatives where he was a sole holder shall be the only persons recognized by the company as having any title to his interest in the shares Nothing in clause (i) shall release the estate of a deceased joint holder from any liability in respect of any share which had been jointly held by him with other persons.",
  },
  {
    part: "II",
    article: "24",
    section: "Transmission of shares",
    description:
      "Any person becoming entitled to a share in consequence of the death or insolvency of a member may upon such evidence being produced as may from time to time properly be required by the Board and subject as hereinafter provided elect either to be registered himself as holder of the share or to make such transfer of the share as the deceased or insolvent member could have made. The Board shall in either case have the same right to decline or suspend registration as it would have had if the deceased or insolvent member had transferred the share before his death or insolvency.",
  },
  {
    part: "II",
    article: "25",
    section: "Transmission of shares",
    description:
      "If the person so becoming entitled shall elect to be registered as holder of the share himself he shall deliver or send to the company a notice in writing signed by him stating that he so elects. If the person aforesaid shall elect to transfer the share he shall testify his election by executing a transfer of the share. All the limitations restrictions and provisions of these regulations relating to the right to transfer and the registration of transfers of shares shall be applicable to any such notice or transfer as aforesaid as if the death or insolvency of the member had not occurred and the notice or transfer were a transfer signed by that member.",
  },
  {
    part: "II",
    article: "26",
    section: "Transmission of shares",
    description:
      "A person becoming entitled to a share by reason of the death or insolvency of the holder shall be entitled to the same dividends and other advantages to which he would be entitled if he were the registered holder of the share except that he shall not before being registered as a member in respect of the share be entitled in respect of it to exercise any right conferred by membership in relation to meetings of the company Provided that the Board may at any time give notice requiring any such person to elect either to be registered himself or to transfer the share and if the notice is not complied with within ninety days the Board may thereafter withhold payment of all dividends bonuses or other monies payable in respect of the share until the requirements of the notice have been complied with.",
  },
  {
    part: "II",
    article: "27",
    section: "Transmission of shares",
    description:
      "In case of a One Person Company on the death of the sole member the person nominated by such member shall be the person recognized by the company as having title to all the shares of the member the nominee on becoming entitled to such shares in case of the members death shall be informed of such event by the Board of the company such nominee shall be entitled to the same dividends and other rights and liabilities to which such sole member of the company was entitled or liable on becoming member such nominee shall nominate any other person with the prior written consent of such person who shall in the event of the death of the member become the member of the company.",
  },
  {
    part: "II",
    article: "28",
    section: "Forfeiture of shares",
    description:
      "If a member fails to pay any call or instalment of a call on the day appointed for payment thereof the Board may at any time thereafter during such time as any part of the call or instalment remains unpaid serve a notice on him requiring payment of so much of the call or instalment as is unpaid together with any interest which may have accrued.",
  },
  {
    part: "II",
    article: "29",
    section: "Forfeiture of shares",
    description:
      "The notice aforesaid shall name a further day (not being earlier than the expiry of fourteen days from the date of service of the notice) on or before which the payment required by the notice is to be made and state that in the event of non-payment on or before the day so named the shares in respect of which the call was made shall be liable to be forfeited.",
  },
  {
    part: "II",
    article: "30",
    section: "Forfeiture of shares",
    description:
      "If the requirements of any such notice as aforesaid are not complied with any share in respect of which the notice has been given may at any time thereafter before the payment required by the notice has been made be forfeited by a resolution of the Board to that effect.",
  },
  {
    part: "II",
    article: "31",
    section: "Forfeiture of shares",
    description:
      "A forfeited share may be sold or otherwise disposed of on such terms and in such manner as the Board thinks fit. At any time before a sale or disposal as aforesaid the Board may cancel the forfeiture on such terms as it thinks fit. A forfeited share may be sold or otherwise disposed of on such terms and in such manner as the Board thinks fit. At any time before a sale or disposal as aforesaid the Board may cancel the forfeiture on such terms as it thinks fit.",
  },
  {
    part: "II",
    article: "32",
    section: "Forfeiture of shares",
    description:
      "A person whose shares have been forfeited shall cease to be a member in respect of the forfeited shares but shall notwithstanding the forfeiture remain liable to pay to the company all monies which at the date of forfeiture were presently payable by him to the company in respect of the shares. The liability of such person shall cease if and when the company shall have received payment in full of all such monies in respect of the shares.",
  },
  {
    part: "II",
    article: "33",
    section: "Forfeiture of shares",
    description:
      "A duly verified declaration in writing that the declarant is a director the manager or the secretary of the company and that a share in the company has been duly forfeited on a date stated in the declaration shall be conclusive evidence of the facts therein stated as against all persons claiming to be entitled to the share The company may receive the consideration if any given for the share on any sale or disposal thereof and may execute a transfer of the share in favor of the person to whom the share is sold or disposed of The transferee shall thereupon be registered as the holder of the share and The transferee shall not be bound to see to the application of the purchase money if any nor shall his title to the share be affected by any irregularity or invalidity in the proceedings in reference to the forfeiture sale or disposal of the share.",
  },
  {
    part: "II",
    article: "34",
    section: "Forfeiture of shares",
    description:
      "The provisions of these regulations as to forfeiture shall apply in the case of non-payment of any sum which by the terms of issue of a share becomes payable at a fixed time whether on account of the nominal value of the share or by way of premium as if the same had been payable by virtue of a call duly made and notified.",
  },
  {
    part: "II",
    article: "35",
    section: "Forfeiture of shares", // NOTE: This is likely "Alteration of Capital"
    description:
      "The company may from time to time by ordinary resolution increase the share capital by such sum to be divided into shares of such amount as may be specified in the resolution",
  },
  {
    part: "II",
    article: "36",
    section: "Alteration of capital",
    description:
      "Subject to the provisions of section 61 the company may by ordinary resolution consolidate and divide all or any of its share capital into shares of larger amount than its existing shares convert all or any of its fully paid-up shares into stock and reconvert that stock into fully paid up shares of any denomination sub-divide its existing shares or any of them into shares of smaller amount than is fixed by the memorandum cancel any shares which at the date of the passing of the resolution have not been taken or agreed to be taken by any person.",
  },
  {
    part: "II",
    article: "37",
    section: "Alteration of capital",
    description:
      "Where shares are converted into stock the holders of stock may transfer the same or any part thereof in the same manner as and subject to the same regulations under which the shares from which the stock arose might before the conversion have been transferred or as near thereto as circumstances admit Provided that the Board may from time to time fix the minimum amount of stock transferable so however that such minimum shall not exceed the nominal amount of the shares from which the stock arose. the holders of stock shall according to the amount of stock held by them have the same rights privileges and advantages as regards dividends voting at meetings of the company and other matters as if they held the shares from which the stock arose but no such privilege or advantage (except participation in the dividends and profits of the company and in the assets on winding up) shall be conferred by an amount of stock which would not if existing in shares have conferred that privilege or advantage. such of the regulations of the company as are applicable to paid-up shares shall apply to stock and the words share and shareholder in those regulations shall include stock and stock-holder respectively",
  },
  {
    part: "II",
    article: "38",
    section: "Alteration of capital",
    description:
      "The company may by special resolution reduce in any manner and with and subject to any incident authorized and consent required by law it share capital any capital redemption reserve account or any share premium account.",
  },
  {
    part: "II",
    article: "39",
    section: "Capitalisation of profits",
    description:
      "The company in general meeting may upon the recommendation of the Board resolve that it is desirable to capitalize any part of the amount for the time being standing to the credit of any of the company's reserve accounts or to the credit of the profit and loss account or otherwise available for distribution and that such sum be accordingly set free for distribution in the manner specified in clause (ii) amongst the members who would have been entitled thereto if distributed by way of dividend and in the same proportions. The sum aforesaid shall not be paid in cash but shall be applied subject to the provision contained in clause (iii) either in or towards paying up any amounts for the time being unpaid on any shares held by such members respectively paying up in full unissued shares of the company to be allotted and distributed credited as fully paid-up to and amongst such members in the proportions aforesaid partly in the way specified in sub-clause (A) and partly in that specified in sub-clause (B) A securities premium account and a capital redemption reserve account may for the purposes of this regulation be applied in the paying up of unissued shares to be issued to members of the company as fully paid bonus shares The Board shall give effect to the resolution passed by the company in pursuance of this regulation.",
  },
  {
    part: "II",
    article: "40",
    section: "Capitalisation of profits",
    description:
      "Whenever such a resolution as aforesaid shall have been passed the Board shall make all appropriations and applications of the undivided profits resolved to be capitalized thereby and all allotments and issues of fully paid shares if any and generally do all acts and things required to give effect thereto. The Board shall have power to make such provisions by the issue of fractional certificates or by payment in cash or otherwise as it thinks fit for the case of shares becoming distributable in fractions and to authorize any person to enter on behalf of all the members entitled thereto into an agreement with the company providing for the allotment to them respectively credited as fully paid-up of any further shares to which they may be entitled upon such capitalization or as the case may require for the payment by the company on their behalf by the application thereto of their respective proportions of profits resolved to be capitalized of the amount or any part of the amounts remaining unpaid on their existing shares Any agreement made under such authority shall be effective and binding on such members",
  },
  {
    part: "II",
    article: "41",
    section: "Buy-back of shares",
    description:
      "Notwithstanding anything contained in these articles but subject to the provisions of sections 68 to 70 and any other applicable provision of the Act or any other law for the time being in force the company may purchase its own shares or other specie securities.",
  },
  {
    part: "II",
    article: "42",
    section: "General meetings",
    description:
      "All general meetings other than annual general meeting shall be called extraordinary general meeting.",
  },
  {
    part: "II",
    article: "43",
    section: "General meetings",
    description:
      " The Board may whenever it thinks t call an extraordinary general meeting. If at any time directors capable of acting who are sufficient in number to form a quorum are not within India any director or any two members of the company may call an extraordinary general meeting in the same manner as nearly as possible as that in which such a meeting may be called by the Board.",
  },
  {
    part: "II",
    article: "44",
    section: "Proceedings at general meetings",
    description:
      "No business shall be transacted at any general meeting unless a quorum of members is present at the time when the meeting proceeds to business. Save as otherwise provided herein the quorum for the general meetings shall be as provided in section 103.",
  },
  {
    part: "II",
    article: "45",
    section: "Proceedings at general meetings",
    description:
      "The chairperson if any of the Board shall preside as Chairperson at every general meeting of the company",
  },
  {
    part: "II",
    article: "46",
    section: "Proceedings at general meetings",
    description:
      "If there is no such Chairperson or if he is not present within fifteen minutes after the time appointed for holding the meeting or is unwilling to act as chairperson of the meeting the directors present shall elect one of their members to be Chairperson of the meeting",
  },
  {
    part: "II",
    article: "47",
    section: "Proceedings at general meetings",
    description:
      "If at any meeting no director is willing to act as Chairperson or if no director is present within fifteen minutes after the time appointed for holding the meeting the members present shall choose one of their number to be Chairperson of the meeting",
  },
  {
    part: "II",
    article: "48",
    section: "Proceedings at general meetings",
    description:
      "In case of a One Person Company the resolution required to be passed at the general meetings of the company shall be deemed to have been passed if the resolution is agreed upon by the sole member and communicated to the company and entered in the minutes book maintained under section 118 such minutes book shall be signed and dated by the member the resolution shall become effective from the date of signing such minutes by the sole member.",
  },
  {
    part: "II",
    article: "49",
    section: "Adjournment of meeting",
    description:
      "The Chairperson may with the consent of any meeting at which a quorum is present and shall if so directed by the meeting adjourn the meeting from time to time and from place to place. No business shall be transacted at any adjourned meeting other than the business left unfished at the meeting from which the adjournment took place. When a meeting is adjourned for thirty days or more notice of the adjourned meeting shall be given as in the case of an original meeting. Save as aforesaid and as provided in section 103 of the Act it shall not be necessary to give any notice of an adjournment or of the business to be transacted at an adjourned meeting.",
  },
  {
    part: "II",
    article: "50",
    section: "Voting rights",
    description:
      "Subject to any rights or restrictions for the time being attached to any class or classes of shares on a show of hands every member present in person shall have one vote and on a poll the voting rights of members shall be in proportion to his share in the paid-up equity share capital of the company.",
  },
  {
    part: "II",
    article: "51",
    section: "Voting rights",
    description:
      "A member may exercise his vote at a meeting by electronic means in accordance with section 108 and shall vote only once",
  },
  {
    part: "II",
    article: "52",
    section: "Voting rights",
    description:
      " In the case of joint holders the vote of the senior who tenders a vote whether in person or by proxy shall be accepted to the exclusion of the votes of the other joint holders. For this purpose seniority shall be determined by the order in which the names stand in the register of members",
  },
  {
    part: "II",
    article: "53",
    section: "Voting rights",
    description:
      "A member of unsound mind or in respect of whom an order has been made by any court having jurisdiction in lunacy may vote whether on a show of hands or on a poll by his committee or other legal guardian and any such committee or guardian may on a poll vote by proxy",
  },
  {
    part: "II",
    article: "54",
    section: "Voting rights",
    description:
      "Any business other than that upon which a poll has been demanded maybe proceeded with pending the taking of the poll.",
  },
  {
    part: "II",
    article: "55",
    section: "Voting rights",
    description:
      "No member shall be entitled to vote at any general meeting unless all calls or other sums presently payable by him in respect of shares in the company have been paid",
  },
  {
    part: "II",
    article: "56",
    section: "Voting rights",
    description:
      "No objection shall be raised to the qualification of any voter except at the meeting or adjourned meeting at which the vote objected to is given or tendered and e very vote not disallowed at such meeting shall be valid for all purposes. Any such objection made in due time shall be referred to the Chairperson of the meeting whose decision shall be nil and conclusive.",
  },
  {
    part: "II",
    article: "57",
    section: "Proxy",
    description:
      "The instrument appointing a proxy and the power-o attorney or other authority if any under which it is signed or a notarized copy of that power or authority shall be deposited at the registered office of the company not less than 48 hours before the time for holding the meeting or adjourned meeting at which the person named in the instrument proposes to vote or in the case of a poll not less than 24 hours before the time appointed for the taking of the poll and in default the instrument of proxy shall not be treated as valid.",
  },
  {
    part: "II",
    article: "58",
    section: "Proxy",
    description:
      "An instrument appointing a proxy shall be in the form as prescribed in the rules made under section 105",
  },
  {
    part: "II",
    article: "59",
    section: "Proxy",
    description:
      "A vote given in accordance with the terms of an instrument of proxy shall be valid notwithstanding the previous death or insanity of the principal or the r e vocation of the proxy or of the authority under which the proxy was executed or the transfer of the shares in respect of which the proxy is given Provided that no intimation in writing of such death insanity r e vocation or transfer shall have been received by the company at its office before the commencement of the meeting or adjourned meeting at which the proxy is used.",
  },
  {
    part: "II",
    article: "60",
    section: "Board of Directors",
    description:
      "(i) The number of directors shall not be more than 15 Directors provided that the company may appoint more than fifteen Directors after passing a special resolution. The first Directors of the Company are a. Mr. Lakshminathan Manicka vasagam b. Mr. Madhumanivasan Lakshminathan",
  },
  {
    part: "II",
    article: "61",
    section: "Board of Directors",
    description:
      "The remuneration of the directors shall in so far as it consists of a monthly payment be deemed to accrue from day-to-da y. In addition to the remuneration payable to them in pursuance of the Act the directors may be paid all travelling hotel and other expenses properly incurred by them in attending and returning from meetings of the Board of Directors or any committee thereof or general meetings of the company or in connection with the business of the company.",
  },
  {
    part: "II",
    article: "62",
    section: "Board of Directors",
    description:
      "The Board may pay all expenses incurred in getting up and registering the company.",
  },
  {
    part: "II",
    article: "63",
    section: "Board of Directors",
    description:
      "The company may exercise the powers conferred on it b y section 88 with regard to the keeping of a foreign register and the Board may (subject to the provisions of that section) make and vary such regulations as it may think fit respecting the keeping of any such register.",
  },
  {
    part: "II",
    article: "64",
    section: "Board of Directors",
    description:
      "All cheques promissory notes drafts hundis bills of exchange and other negotiable instruments and all receipts for monies paid to the company shall be signed drawn accepted endorsed or otherwise executed as the case may be by such person and in such manner as the Board shall from time to time by resolution determine",
  },
  {
    part: "II",
    article: "65",
    section: "Board of Directors",
    description:
      "Every director present at any meeting of the Board or of a committee thereof shall sign his name in a book to be kept for that purpose.",
  },
  {
    part: "II",
    article: "66",
    section: "Board of Directors",
    description:
      "Subject to the provisions of section 149 the Board shall have power at any time and from time to time to appoint a person as an additional director provided the number of the directors and additional directors together shall not at any time exceed the maximum strength fixed for the Board by the articles. Such person shall hold office only up to the date of the next annual general meeting of the company but shall be eligible for appointment by the company as a director at that meeting subject to the provisions of the Act.",
  },
  {
    part: "II",
    article: "67",
    section: "Proceedings of the Board",
    description:
      "The Board of Directors may meet for the conduct of business adjourn and otherwise regulate its meetings as it thinks fit. A director may and the manager or secretary on the requisition of a director shall at any time summon a meeting of the Board.",
  },
  {
    part: "II",
    article: "68",
    section: "Proceedings of the Board",
    description:
      "Save as otherwise expressly provided in the Act questions arising at any meeting of the Board shall be decided by a majority of votes. In case of an equality of votes the Chairperson of the Board if any shall have a second or casting vote.",
  },
  {
    part: "II",
    article: "69",
    section: "Proceedings of the Board",
    description:
      "The continuing directors may act notwithstanding any vacancy in the Board but if and so long as their number is reduced below the quorum fixed by the Act for a meeting of the Board the continuing directors or director may act for the purpose of increasing the number of directors to that fixed for the quorum or of summoning a general meeting of the company but for no other purpose.",
  },
  {
    part: "II",
    article: "70",
    section: "Proceedings of the Board",
    description:
      "The Board may elect a Chairperson of its meetings and determine the period for which he is to hold office. If no such Chairperson is elected or if at any meeting the Chairperson is not present within five minutes after the time appointed for holding the meeting the directors present may choose one of their number to be Chairperson of the meeting.",
  },
  {
    part: "II",
    article: "71",
    section: "Proceedings of the Board",
    description:
      "The Board may subject to the provisions of the Act delegate any of its powers to committees consisting of such member or members of its body as it thinks fit. Any committee so formed shall in the exercise of the powers so delegated conform to any regulations that may be imposed on it by the Board.",
  },
  {
    part: "II",
    article: "72",
    section: "Proceedings of the Board",
    description:
      "A committee may elect a Chairperson of its meetings. If no such Chairperson is elected or if at any meeting the Chairperson is not present within five minutes after the time appointed for holding the meeting the members present may choose one of their members to be Chairperson of the meeting.",
  },
  {
    part: "II",
    article: "73",
    section: "Proceedings of the Board",
    description:
      "A committee may meet and adjourn as it thinks fit. Questions arising at any meeting of a committee shall be determined by a majority of votes of the members present and in case of an equality of votes the Chairperson shall have a second or casting vote",
  },
  {
    part: "II",
    article: "74",
    section: "Proceedings of the Board",
    description:
      "All acts done in any meeting of the Board or of a committee thereof or by any person acting as a director shall notwithstanding that it may be afterwards discovered that there was some defect in the appointment of any one or more of such directors or of any person acting as aforesaid or that they or any of them were disqualified be as valid as if every such director or such person had been duly appointed and was qualified to be a director.",
  },
  {
    part: "II",
    article: "75",
    section: "Proceedings of the Board",
    description:
      "Save as otherwise expressly provided in the Act a resolution in writing signed by all the members of the Board or of a committee thereof for the time being entitled to receive notice of a meeting of the Board or committee shall be valid and effective as if it had been passed at a meeting of the Board or committee duly convened and held.",
  },
  {
    part: "II",
    article: "76",
    section: "Proceedings of the Board",
    description:
      "In case of a One Person Company where the company is having only one director all the businesses to be transacted at the meeting of the Board shall be entered into minutes book maintained under section 118 such minutes book shall be signed and dated by the director the resolution shall become effective from the date of signing such minutes by the director.",
  },
  {
    part: "II",
    article: "77",
    section:
      "Chief Executive Oﬃcer, Manager, Company Secretary or Chief Financial Oﬃcer",
    description:
      "Subject to the provisions of the Act A chief executive officer manager company secretary or chief financial officer may be appointed by the Board for such term at such remuneration and upon such conditions as it may think fit and any chief executive officer manager company secretary or chief financial officer so appointed may be removed by means of a resolution of the Board A director may be appointed as chief executive officer manager company secretary or chief financial officer.",
  },
  {
    part: "II",
    article: "78",
    section:
      "Chief Executive Oﬃcer, Manager, Company Secretary or Chief Financial Oﬃcer",
    description:
      "A provision of the Act or these regulations requiring or authorizing a thing to be done by or to a director and chief executive officer manager company secretary or chief financial officer shall not be satisfied by its being done by or to the same person acting both as director and as or in place of chief executive officer manager company secretary or chief financial officer.",
  },
  {
    part: "II",
    article: "79",
    section: "The Seal",
    description:
      "The Board shall provide for the safe custody of the seal. The seal of the company shall not be affixed to any instrument except by the authority of a resolution of the Board or of a committee of the Board authorized by it in that behalf and except in the presence of at least two directors and of the secretary or such other person as the Board may appoint for the purpose and those two directors and the secretary or other person aforesaid shall sign every instrument to which the seal of the company is so affixed in their presence.",
  },
  {
    part: "II",
    article: "80",
    section: "Dividends and Reserve",
    description:
      "The company in general meeting may declare dividends but no dividend shall exceed the amount recommended by the Board",
  },
  {
    part: "II",
    article: "81",
    section: "Dividends and Reserve",
    description:
      "Subject to the provisions of section 123 the Board may from time to time pay to the members such interim dividends as appear to it to be justified by the profits of the company.",
  },
  {
    part: "II",
    article: "82",
    section: "Dividends and Reserve",
    description:
      "The Board may before recommending any dividend set aside out of the profits of the company such sums as it thinks fit as a reserve or reserves which shall at the discretion of the Board be applicable for any purpose to which the profits of the company may be properly applied including provision for meeting contingencies or for equalizing dividends and pending such application may at the like discretion either be employed in the business of the company or be invested in such investments (other than shares of the company) as the Board may from time to time thinks fit. The Board may also carry forward any profits which it may consider necessary not to divide without setting them aside as a reserve",
  },
  {
    part: "II",
    article: "83",
    section: "Dividends and Reserve",
    description:
      "Subject to the rights of persons if any entitled to shares with special rights as to dividends all dividends shall be declared and paid according to the amounts paid or credited as paid on the shares in respect whereof the dividend is paid but if and so long as nothing is paid upon any of the shares in the company dividends may be declared and paid according to the amounts of the shares. No amount paid or credited as paid on a share in advance of calls shall be treated for the purposes of this regulation as paid on the share. All dividends shall be apportioned and paid proportionately to the amounts paid or credited as paid on the shares during any portion or portions of the period in respect of which the dividend is paid but if any share is issued on terms providing that it shall rank for dividend as from a particular date such share shall rank for dividend accordingly.",
  },
  {
    part: "II",
    article: "84",
    section: "Dividends and Reserve",
    description:
      "The Board may deduct from any dividend payable to any member all sums of money if any presently payable by him to the company on account of calls or otherwise in relation to the shares of the company.",
  },
  {
    part: "II",
    article: "85",
    section: "Dividends and Reserve",
    description:
      "Any dividend interest or other monies payable in cash in respect of shares may be paid by cheque or warrant sent through the post directed to the registered address of the holder or in the case of joint holders to the registered address of that one of the joint holders who is first named on the register of members or to such person and to such address as the holder or joint holders may in writing direct. Every such cheque or warrant shall be made payable to the order of the person to whom it is sent.",
  },
  {
    part: "II",
    article: "86",
    section: "Dividends and Reserve",
    description:
      "Any one of two or more joint holders of a share may give effective receipts for any dividends bonuses or other monies payable in respect of such share.",
  },
  {
    part: "II",
    article: "87",
    section: "Dividends and Reserve",
    description:
      "Notice of any dividend that may have been declared shall be given to the persons entitled to share therein in the manner mentioned in the Act.",
  },
  {
    part: "II",
    article: "88",
    section: "Dividends and Reserve",
    description: "No dividend shall bear interest against the company.",
  },
  {
    part: "II",
    article: "89",
    section: "Accounts",
    description:
      "The Board shall from time to time determine whether and to what extent and at what times and places and under what conditions or regulations the accounts and books of the company or any of them shall be open to the inspection of members not being directors. No member (not being a director) shall have any right of inspecting any account or book or document of the company except as conferred by law or authorized by the Board or by the company in general meeting.",
  },
  {
    part: "II",
    article: "90",
    section: "Winding up",
    description:
      "Subject to the provisions of Chapter XX of the Act and rules made thereunder If the company shall be wound up the liquidator may with the sanction of a special resolution of the company and any other sanction required by the Act divide amongst the members in specie or kind the whole or any part of the assets of the company whether they shall consist of property of the same kind or not. For the purpose aforesaid the liquidator may set such value as he deems fair upon any property to be divided as aforesaid and may determine how such division shall be carried out as between the members or different classes of members. The liquidator may with the like sanction vest the whole or any part of such assets in trustees upon such trusts for the benefit of the contributories if he considers necessary but so that no member shall be compelled to accept any shares or other securities whereon there is any liability.",
  },
  {
    part: "II",
    article: "91",
    section: "Indemnity",
    description:
      "Every officer of the company shall be indemnified out of the assets of the company against any liability incurred by him in defending any proceedings whether civil or criminal in which judgment is given in his favor or in which he is acquitted or in which relief is granted to him by the court or the Tribunal.",
  },
  {
    part: "II",
    article: "92", // This is the last article for Table F/G
    section: "Others",
    description: "",
  },
];

const sampleAoAData_H = [
  {
    part: "I",
    article: "N/A",
    section: "Interpretation",
    description:
      "In these regulations the Act means the Companies Act 2013 the seal means the common seal of the company.Unless the context otherwise requires words or expressions contained in these regulations shall bear the same meaning as in the Act or any statutory modification thereof in force at the date at which these regulations become binding on the company.",
  },
  {
    part: "II",
    article: "1",
    section: "Members",
    description: `The number of members with which the company proposes to be registered is [Specify Number, e.g., twenty], but the Board of Directors may, from time to time, register an increase of members.`,
  },
  {
    part: "II",
    article: "2",
    section: "Members",
    description: `The subscribers to the memorandum and such other persons as the Board shall admit to membership shall be members of the Company.`,
  },
  {
    part: "II",
    article: "3",
    section: "General meetings",
    description:
      "All general meetings other than annual general meeting shall be called extraordinary general meeting.",
  },
  {
    part: "II",
    article: "4",
    section: "General meetings",
    description:
      "The Board may whenever it thinks fit call an extraordinary general meeting. If at any time directors capable of acting who are sufficient in number to form a quorum are not within India, any director or any two members of the company may call an extraordinary general meeting in the same manner as nearly as possible as that in which such a meeting may be called by the Board.",
  },
  {
    part: "II",
    article: "5",
    section: "Proceedings at general meetings",
    description:
      "No business shall be transacted at any general meeting unless a quorum of members is present at the time when the meeting proceeds to business. Save as otherwise provided herein, the quorum for the general meetings shall be as provided in section 103.",
  },
  {
    part: "II",
    article: "6",
    section: "Proceedings at general meetings",
    description:
      "The chairperson if any of the Board shall preside as Chairperson at every general meeting of the company.",
  },
  {
    part: "II",
    article: "7",
    section: "Proceedings at general meetings",
    description:
      "If there is no such Chairperson or if he is not present within fifteen minutes after the time appointed for holding the meeting or is unwilling to act as chairperson of the meeting, the directors present shall elect one of their members to be Chairperson of the meeting.",
  },
  {
    part: "II",
    article: "8",
    section: "Proceedings at general meetings",
    description:
      "If at any meeting no director is willing to act as Chairperson or if no director is present within fifteen minutes after the time appointed for holding the meeting, the members present shall choose one of their members to be Chairperson of the meeting.",
  },
  {
    part: "II",
    article: "9",
    section: "Adjournment of meeting",
    description:
      "The Chairperson may, with the consent of any meeting at which a quorum is present, and shall if so directed by the meeting, adjourn the meeting from time to time and from place to place. No business shall be transacted at any adjourned meeting other than the business left unfinished at the meeting from which the adjournment took place. When a meeting is adjourned for thirty days or more, notice of the adjourned meeting shall be given as in the case of an original meeting. Save as aforesaid and as provided in section 103 of the Act, it shall not be necessary to give any notice of an adjournment or of the business to be transacted at an adjourned meeting.",
  },
  {
    part: "II",
    article: "10",
    section: "Voting rights",
    description: "Every member shall have one vote.",
  },
  {
    part: "II",
    article: "11",
    section: "Voting rights",
    description:
      "A member of unsound mind or in respect of whom an order has been made by any court having jurisdiction in lunacy may vote, whether on a show of hands or on a poll, by his committee or other legal guardian, and any such committee or guardian may on a poll vote by proxy.",
  },
  {
    part: "II",
    article: "12",
    section: "Voting rights",
    description:
      "No member shall be entitled to vote at any general meeting unless all calls or other sums presently payable by him in respect of shares in the company have been paid.",
  },
  {
    part: "II",
    article: "13",
    section: "Voting rights",
    description:
      "No objection shall be raised to the qualification of any voter except at the meeting or adjourned meeting at which the vote objected to is given or tendered, and every vote not disallowed at such meeting shall be valid for all purposes. Any such objection made in due time shall be referred to the Chairperson of the meeting, whose decision shall be final and conclusive.",
  },
  {
    part: "II",
    article: "14",
    section: "Voting rights",
    description:
      "A vote given in accordance with the terms of an instrument of proxy shall be valid notwithstanding the previous death or insanity of the principal or the revocation of the proxy or of the authority under which the proxy was executed or the transfer of the shares in respect of which the proxy is given, provided that no intimation in writing of such death, insanity, revocation, or transfer shall have been received by the company at its office before the commencement of the meeting or adjourned meeting at which the proxy is used.",
  },
  {
    part: "II",
    article: "15",
    section: "Voting rights",
    description:
      "A member may exercise his vote at a meeting by electronic means in accordance with section 108 and shall vote only once.",
  },
  {
    part: "II",
    article: "16",
    section: "Voting rights",
    description:
      "Any business other than that upon which a poll has been demanded may be proceeded with pending the taking of the poll.",
  },
  {
    part: "II",
    article: "17",
    section: "Board of Directors",
    description:
      "The Company shall have a minimum of two Directors and a maximum of fifteen Directors.\nThe First Directors of the Company shall be:\n1. Mr. C. Srinivasa Raju\n2. Mr. Sannareddy Ravindra Babu\n3. Mr. Deenanath Harapanahalli",
  },
  {
    part: "II",
    article: "18",
    section: "Board of Directors",
    description:
      "The remuneration of the directors shall, in so far as it consists of a monthly payment, be deemed to accrue from day to day. In addition to the remuneration payable to them in pursuance of the Act, the directors may be paid all travelling, hotel, and other expenses properly incurred by them in attending and returning from meetings of the Board of Directors or any committee thereof or general meetings of the company, or in connection with the business of the company.",
  },
  {
    part: "II",
    article: "19",
    section: "Proceedings of the Board",
    description:
      "The Board of Directors may meet for the conduct of business, adjourn, and otherwise regulate its meetings as it thinks fit. A director may, and the manager or secretary on the requisition of a director shall, at any time summon a meeting of the Board.",
  },
  {
    part: "II",
    article: "20",
    section: "Proceedings of the Board",
    description:
      "Save as otherwise expressly provided in the Act, questions arising at any meeting of the Board shall be decided by a majority of votes. In case of an equality of votes, the Chairperson of the Board, if any, shall have a second or casting vote.",
  },
  {
    part: "II",
    article: "21",
    section: "Proceedings of the Board",
    description:
      "The continuing directors may act notwithstanding any vacancy in the Board, but if and so long as their number is reduced below the quorum fixed by the Act for a meeting of the Board, the continuing directors or director may act for the purpose of increasing the number of directors to that fixed for the quorum or of summoning a general meeting of the company, but for no other purpose.",
  },
  {
    part: "II",
    article: "22",
    section: "Proceedings of the Board",
    description:
      "The Board may elect a Chairperson of its meetings and determine the period for which he is to hold office. If no such Chairperson is elected, or if at any meeting the Chairperson is not present within five minutes after the time appointed for holding the meeting, the directors present may choose one of their number to be Chairperson of the meeting.",
  },
  {
    part: "II",
    article: "23",
    section: "Proceedings of the Board",
    description:
      "The Board may, subject to the provisions of the Act, delegate any of its powers to committees consisting of such member or members of its body as it thinks fit. Any committee so formed shall, in the exercise of the powers so delegated, conform to any regulations that may be imposed on it by the Board.",
  },
  {
    part: "II",
    article: "24",
    section: "Proceedings of the Board",
    description:
      "A committee may elect a Chairperson of its meetings. If no such Chairperson is elected, or if at any meeting the Chairperson is not present within five minutes after the time appointed for holding the meeting, the members present may choose one of their members to be Chairperson of the meeting.",
  },
  {
    part: "II",
    article: "25",
    section: "Proceedings of the Board",
    description:
      "A committee may meet and adjourn as it thinks fit. Questions arising at any meeting of a committee shall be determined by a majority of votes of the members present, and in case of an equality of votes, the Chairperson shall have a second or casting vote.",
  },
  {
    part: "II",
    article: "26",
    section: "Proceedings of the Board",
    description:
      "All acts done in any meeting of the Board or of a committee thereof, or by any person acting as a director, shall, notwithstanding that it may be afterwards discovered that there was some defect in the appointment of any one or more of such directors or of any person acting as aforesaid, or that they or any of them were disqualified, be as valid as if every such director or such person had been duly appointed and was qualified to be a director.",
  },
  {
    part: "II",
    article: "27",
    section: "Proceedings of the Board",
    description:
      "Save as otherwise expressly provided in the Act, a resolution in writing signed by all the members of the Board or of a committee thereof for the time being entitled to receive notice of a meeting of the Board or committee shall be valid and effective as if it had been passed at a meeting of the Board or committee duly convened and held.",
  },
  {
    part: "II",
    article: "28",
    section:
      "Chief Executive Oﬃcer, Manager, Company Secretary or Chief Financial Oﬃcer",
    description:
      "Subject to the provisions of the Act, a Chief Executive Officer, Manager, Company Secretary, or Chief Financial Officer may be appointed by the Board for such term, at such remuneration, and upon such conditions as it may think fit; and any Chief Executive Officer, Manager, Company Secretary, or Chief Financial Officer so appointed may be removed by means of a resolution of the Board. A director may be appointed as Chief Executive Officer, Manager, Company Secretary, or Chief Financial Officer.",
  },
  {
    part: "II",
    article: "29",
    section:
      "Chief Executive Oﬃcer, Manager, Company Secretary or Chief Financial Oﬃcer",
    description:
      "A provision of the Act or these regulations requiring or authorising a thing to be done by or to a director and Chief Executive Officer, Manager, Company Secretary, or Chief Financial Officer shall not be satisfied by its being done by or to the same person acting both as director and as, or in place of, Chief Executive Officer, Manager, Company Secretary, or Chief Financial Officer.",
  },
  {
    part: "II",
    article: "30",
    section: "The Seal",
    description:
      "The Board shall provide for the safe custody of the seal. The seal of the company shall not be affixed to any instrument except by the authority of a resolution of the Board or of a committee of the Board authorised by it in that behalf, and except in the presence of at least two directors and of the secretary or such other person as the Board may appoint for the purpose, and those two directors and the secretary or other person aforesaid shall sign every instrument to which the seal of the company is so affixed in their presence.",
  },
  {
    part: "II",
    article: "31", // This is the last article for Table H
    section: "Others",
    description: "",
  },
];


export default function NameReservation() {
  const totalCards = 9;
const { token, orgId } = useAuth();

  const [currentCard, setCurrentCard] = useState(1);
  const navigate = useNavigate();

  const [moaCompanyName, setMoaCompanyName] = useState();
  const [moaTableSelect, setMoaTableSelect] = useState("");
  const [moaStateOffice, setMoaStateOffice] = useState("");
  const [defaultMoaClause1,setDefaultMoaClause1] = useState(
    ``
  );
  const [defaultMoaClause2,setDefaultMoaClause2] = useState(
    ``
  );
  const [moaMainObjectClause1, setMoaMainObjectClause1] =
    useState(defaultMoaClause1);
  const [moaMainObjectClause2, setMoaMainObjectClause2] =
    useState(defaultMoaClause2);

  const [contributionLimit, setContributionLimit] = useState("");
  const [shareCapitalAmount, setShareCapitalAmount] = useState("1000000");
  const [numberOfShares, setNumberOfShares] = useState("100000");
  const [shareType, setShareType] = useState("Equity Share");
  const [shareValue, setShareValue] = useState("10");
  const [clause6Option, setClause6Option] = useState("option1");

const moaTableOptions = [
  { value: "A", label: "A - Memorandum of Association of a Company Limited by Shares" },
  { value: "B", label: "B - Memorandum of Association of a Company Limited by Guarantee and Not Having a Share Capital" },
  { value: "C", label: "C - Memorandum of Association of a Company Limited by Guarantee and Having a Share Capital" },
  { value: "D", label: "D - Memorandum of Association of an Unlimited Company and Not Having Share Capital" },
  { value: "E", label: "E - Memorandum of Association of an Unlimited Company and Having Share Capital" },
];
const [isGenerating, setIsGenerating] = useState(false);





 const [subscribers, setSubscribers] = useState([]);
 



  const [witnesses, setWitnesses] = useState([
    {
      id: 1,
      type: "ACA",
      name: "Aparna Joshi",
      addressDesc:
        "B-602, Arvind Skylands, Nehru Nagar, Yelahanka, Bangalore - 560064, Professional",
      idNumber: "2*1*5*",
      dsc: "Signed",
      date: "2025-04-09",
    },
    {
      id: 2,
      type: "",
      name: "",
      addressDesc: "",
      idNumber: "",
      dsc: "",
      date: "",
    },
  ]);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeParentName, setNomineeParentName] = useState("");
  const [nomineeAddress, setNomineeAddress] = useState("");
  const [nomineeAge, setNomineeAge] = useState("");

  const [aoaTableSelect, setAoaTableSelect] = useState("F"); // Default to F
  const [aoaTableDescription, setAoaTableDescription] = useState('');

const [aoaCompanyName, setAoaCompanyName] = useState("");

  const [currentAoaRowIndex, setCurrentAoaRowIndex] = useState(-1);
  const [editedAoaData, setEditedAoaData] = useState([]);
  const [aoaDescriptionText, setAoaDescriptionText] = useState("");
  const aoaDescriptionTextareaRef = useRef(null);
  const tableDescriptions = useRef({
    F: "F - A COMPANY LIMITED BY SHARES",
    G: "G - a company limited by guarantee and having a share capital",
    H: "H - a company limited by guarantee and not having share capital",
  }).current;

  const [activeMoaTab, setActiveMoaTab] = useState("moa-final-tab");
  const [activeAoaTab, setActiveAoaTab] = useState("aoa-final-tab");

  const [moaClause1Copied, setMoaClause1Copied] = useState(false);
  const [moaClause2Copied, setMoaClause2Copied] = useState(false);
  const [aoaFooterCopied, setAoaFooterCopied] = useState(false);

  const copyToClipboard = async (textToCopy, setCopiedState) => {
    if (!textToCopy || !navigator.clipboard) {
      alert("Clipboard API not available or nothing to copy.");
      return false;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
      return true;
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text.");
      return false;
    }
  };

  const getActiveAoaData = () => {
    return aoaTableSelect === "H" ? sampleAoAData_H : sampleAoaData;
  };

  const getAoaTableDescription = (selectedValue) => {
    return tableDescriptions[selectedValue] || "Description not available";
  };

  const getAoaTemplateText = (articleData) => {
    if (!articleData) return "";
    const effectiveCompanyName = aoaCompanyName || "the Company"; // Uses state: aoaCompanyName
    
    const description = String(articleData.description || "");

    if (aoaTableSelect === "F" || aoaTableSelect === "G") {
        // The placeholder in sampleAoaData is `toInitCap(sampleFormData.companyName)`
        // which evaluates to `toInitCap("KRYON TECHNOLOGY PRIVATE LIMITED")` -> "Kryon Technology Private Limited"
        const placeholderInTemplate = toInitCap(sampleFormData.companyName); 
        return description.replace(
          new RegExp(
            placeholderInTemplate.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), // Escape regex special chars
            "g"
          ),
          toInitCap(effectiveCompanyName) // Replace with init-capped version of the current AoA company name
        );
    }
    // For Table H, the sample data's descriptions don't have company name placeholders.
    return description;
  };


  const displayAoaPlaceholderRow = () => {
    setCurrentAoaRowIndex(-1);
    setAoaDescriptionText("");
  };

  const activateMoaTab = (tabId) => {
    setActiveMoaTab(tabId);
    setMoaClause1Copied(false);
    setMoaClause2Copied(false);
  
    if (tabId === 'moa-final-tab') {
      if (!moaMainObjectClause1?.trim()) {
        setMoaMainObjectClause1(defaultMoaClause1);
      }
      if (!moaMainObjectClause2?.trim()) {
        setMoaMainObjectClause2(defaultMoaClause2);
      }
    }
  };
  

  const activateAoaTab = (tabId) => {
    if (activeAoaTab === "aoa-final-tab" && currentAoaRowIndex !== -1) {
      saveCurrentAoaDescription();
    }
    setActiveAoaTab(tabId);
    setAoaFooterCopied(false);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalCards) {
      setCurrentCard(pageNumber);
    }
  };

  const displaySingleAoaRow = (index) => {
    const activeData = getActiveAoaData();

    if (activeAoaTab === "aoa-final-tab" && currentAoaRowIndex !== -1) {
      saveCurrentAoaDescription(currentAoaRowIndex); // Save previous before switching
    }

    if (index < 0 || index >= activeData.length) {
      displayAoaPlaceholderRow();
    } else {
      setCurrentAoaRowIndex(index);
      const rowData = activeData[index];
      if (!rowData) {
        displayAoaPlaceholderRow();
        return;
      }

      const editedEntry = editedAoaData.find(
        (item) =>
          item.part === rowData.part &&
          item.article === rowData.article &&
          item.section === rowData.section
      );

      let descriptionForFinalTab;
      if (editedEntry) {
        descriptionForFinalTab = editedEntry.description;
      } else {
        // If not edited, show the original template text for the "Final" tab as well
        descriptionForFinalTab = getAoaTemplateText(rowData);
        descriptionForFinalTab = descriptionForFinalTab || "";
      }
      setAoaDescriptionText(descriptionForFinalTab);

      if (aoaDescriptionTextareaRef.current) {
        aoaDescriptionTextareaRef.current.scrollTop = 0;
      }
    }
    setAoaFooterCopied(false);
  };

const saveCurrentAoaDescription = (indexToSave = currentAoaRowIndex) => {
  if (!Array.isArray(editedAoaData)) {
    console.error("saveCurrentAoaDescription: editedAoaData is not an array! Skipping save.", editedAoaData);
    return;
  }

  const activeData = getActiveAoaData();
  if (activeAoaTab !== "aoa-final-tab") return;

  if (indexToSave < 0 || indexToSave >= activeData.length) return;

  const currentArticle = activeData[indexToSave];
  if (!currentArticle) return;

  const editedTextInFinalTab = aoaDescriptionText;
  const originalGeneratedText = getAoaTemplateText(currentArticle) || "";

  // 🔑 Generate articleKey for fillAOA format
  let articleKey;
  if (currentArticle.part === "I" && currentArticle.section === "Interpretation") {
    articleKey = "article1";
  } else if (currentArticle.part === "II" && currentArticle.article) {
    articleKey = `article2_${String(currentArticle.article).replace(/\./g, "_")}`;
  }

  const existingEditIndex = editedAoaData.findIndex(
    (item) =>
      item &&
      item.part === currentArticle.part &&
      item.article === currentArticle.article &&
      item.section === currentArticle.section
  );

  let updatedEdits = [...editedAoaData];
  let changed = false;

  const isCustomAndNotEmpty = editedTextInFinalTab.trim() !== "" && editedTextInFinalTab.trim() !== originalGeneratedText.trim();

  if (existingEditIndex > -1) {
    if (isCustomAndNotEmpty) {
      if (updatedEdits[existingEditIndex].description !== editedTextInFinalTab) {
        updatedEdits[existingEditIndex].description = editedTextInFinalTab;
        updatedEdits[existingEditIndex].articleKey = articleKey;
        changed = true;
      }
    } else {
      updatedEdits.splice(existingEditIndex, 1);
      changed = true;
    }
  } else {
    if (isCustomAndNotEmpty)
       {
      updatedEdits.push({
        
        part: currentArticle.part,
        article: currentArticle.article,
        section: currentArticle.section,
        description: editedTextInFinalTab,
        articleKey, // ✅ include it
      });
      changed = true;
    }
  }

  if (changed) {
  console.log("📝 Saved AOA Edit:", updatedEdits[existingEditIndex] || updatedEdits[updatedEdits.length - 1]);
  setEditedAoaData(updatedEdits);
}

};

  const { companyType } = useCompanyType();


  useEffect(() => {
    if (currentCard === 7) {
      const activeData = getActiveAoaData();
      if (!aoaCompanyName && (moaCompanyName || sampleFormData.companyName)) {
         setAoaCompanyName(toInitCap(moaCompanyName || sampleFormData.companyName));
      }
      if (currentAoaRowIndex === -1 && activeData.length > 0) {
        displaySingleAoaRow(0);
      } else if (currentAoaRowIndex >= 0) {
        if (currentAoaRowIndex < activeData.length) {
          // Re-display to ensure text area reflects current state, esp. after table change
          displaySingleAoaRow(currentAoaRowIndex); 
        } else {
          displaySingleAoaRow(0); // Fallback if index out of bounds
        }
      } else {
        displayAoaPlaceholderRow();
      }
    }
  }, [currentCard, aoaTableSelect, aoaCompanyName]); // Added aoaCompanyName dependency


  const showNextAoaArticle = () => {
    const activeData = getActiveAoaData();
    saveCurrentAoaDescription(); // Save current before moving
    if (currentAoaRowIndex < activeData.length - 1) {
      displaySingleAoaRow(currentAoaRowIndex + 1);
    }
  };

  const showPreviousAoaArticle = () => {
    saveCurrentAoaDescription(); // Save current before moving
    if (currentAoaRowIndex > 0) {
      displaySingleAoaRow(currentAoaRowIndex - 1);
    }
  };

  const copyAoaGenerateArticleForFooter = async () => {
    if (currentAoaRowIndex < 0) return;
    const activeData = getActiveAoaData();
    const currentArticleData = activeData[currentAoaRowIndex];
    const textToCopy = getAoaTemplateText(currentArticleData); // This uses aoaCompanyName state
    copyToClipboard(textToCopy, setAoaFooterCopied);
  };
  const shouldSkipPage6 = moaTableSelect === "A";


const prepareArticleFields = (
  currentEditedData, 
  currentTableSelect,
  getTemplateTextFunction // This is getAoaTemplateText from the component scope
) => {
  const articleFields = {};
  const activeDataSource = currentTableSelect === "H" ? sampleAoAData_H : sampleAoaData;

  const findEditedItem = (sourcePart, sourceArticleNum, sourceSectionName) => {
    if (!Array.isArray(currentEditedData)) {
        console.error("prepareArticleFields: currentEditedData is not an array!", currentEditedData);
        return undefined;
    }
    return currentEditedData.find(
      (item) =>
        item.part === sourcePart &&
        item.article === sourceArticleNum &&
        item.section === sourceSectionName
    );
  };

  activeDataSource.forEach(sourceItem => {
    if (!sourceItem || !sourceItem.part) return;
        const editedEntry = findEditedItem(sourceItem.part, sourceItem.article, sourceItem.section);


   let key;
if (editedEntry?.articleKey) {
  key = editedEntry.articleKey;
} else if (sourceItem.part === "I" && sourceItem.section === "Interpretation") {
  key = "article1";
} else if (sourceItem.part === "II" && sourceItem.article && String(sourceItem.article).trim() !== "") {
  key = `article2_${String(sourceItem.article).replace(/\./g, "_")}`;
} else {
  return;
}


    
    let finalDescription;
    let isAltered = false;

    if (editedEntry) {
      // This article exists in currentEditedData, meaning its description was customized
      // and is non-empty and different from the template.
      finalDescription = editedEntry.description;
      isAltered = true; 
    } else {
      // This article is not in currentEditedData.
      // Its description is either the original template text, or it was edited and then cleared/reverted.
      // In all these "not in currentEditedData" cases, isAltered is false.
      finalDescription = getTemplateTextFunction(sourceItem); // Uses aoaCompanyName from its own closure
      isAltered = false;
    }
    
    articleFields[key] = {
      check_if_not_applicale: false, 
      check_if_altered: isAltered,
      description: finalDescription || "", 
    };
  });

  return articleFields;
};


const handleNext = async () => {
  if (currentCard === 7) {
    saveCurrentAoaDescription(); 

    const articlesPayload = prepareArticleFields(
      editedAoaData,      
      aoaTableSelect,     
      getAoaTemplateText 
    );

    const apiPayloadData = {
      applicable_table: aoaTableSelect,
      table_description: getAoaTableDescription(aoaTableSelect),
      company_name: aoaCompanyName, // aoaCompanyName from state, should be InitCapped
      ...articlesPayload, 
    };
    
    const finalApiPayload = {
      org_id: orgId,
      data: apiPayloadData
    };

    console.log("📤 Sending AOA Payload:", JSON.stringify(finalApiPayload, null, 2));

    try {
      const response = await fetch("http://3.111.226.182/factops/coform/fillAOA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalApiPayload),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        console.log("✅ AOA data saved successfully:", result);
      } else {
        console.error("❌ Failed to save AOA data:", result.message || result, "Status:", response.status);
        console.error("❌ Payload sent on error:", JSON.stringify(finalApiPayload, null, 2));
      }
    } catch (error) {
      console.error("❌ Network or other error submitting AOA:", error);
      console.error("❌ Payload during network error:", JSON.stringify(finalApiPayload, null, 2));
    }
  }

  if (
    (currentCard === 1 || currentCard === 2) &&
    (activeMoaTab === 'moa-final-tab' || activeMoaTab === 'moa-generate-tab')
  ) {
    try {
      const response = await fetch('http://3.111.226.182/factops/coform/moa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          org_id: orgId,
          section_3A: moaMainObjectClause1,
          section_3B: moaMainObjectClause2,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        console.log('✅ MOA updated:', data.message);
      } else {
        console.warn('⚠️ MOA update failed:', data);
      }
    } catch (err) {
      console.error('❌ Error updating MOA:', err);
    }
  }

  if (currentCard === 1) {
    console.log("Final MoA Clause 1:", moaMainObjectClause1);
  }
  if (currentCard === 2) {
    console.log("Final MoA Clause 2:", moaMainObjectClause2);
  }

  if (currentCard < totalCards) {
    let nextCard = currentCard + 1;
    if (nextCard === 6 && shouldSkipPage6) {
        nextCard = 7; 
    }
    setCurrentCard(nextCard);
  } else {
    console.log("Reached end of MoA/AoA section.");
    console.log("Final MoA Clause 1:", moaMainObjectClause1);
    console.log("Final MoA Clause 2:", moaMainObjectClause2);
    navigate("/inc-9");
  }
};



const handlePrev = () => {
  if (currentCard === 7) {
    saveCurrentAoaDescription(); // Save before navigating away
    console.log("Moving back from AoA. Current Edited AoA Data:", editedAoaData);
  }
  if (currentCard === 1) console.log("Final MoA Clause 1:", moaMainObjectClause1);
  if (currentCard === 2) console.log("Final MoA Clause 2:", moaMainObjectClause2);

  if (currentCard === 7 && shouldSkipPage6) {
    setCurrentCard(5); 
  } else if (currentCard > 1) {
    setCurrentCard((prev) => prev - 1);
  } else {
    console.log("At the beginning of MoA/AoA");
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentCard === 7) {
      saveCurrentAoaDescription();
    }
    console.log("Form submitted (potentially).");
    console.log("Final MoA Clause 1:", moaMainObjectClause1);
    console.log("Final MoA Clause 2:", moaMainObjectClause2);
    console.log("Final Edited AoA Data:", editedAoaData);
    navigate("/inc-9");
  };

  const handleSubscriberChange = (index, field, value) => {
    const updatedSubscribers = [...subscribers];
    updatedSubscribers[index][field] = value;
    setSubscribers(updatedSubscribers);
  };

  const handleWitnessChange = (index, field, value) => {
    const updatedWitnesses = [...witnesses];
    updatedWitnesses[index][field] = value;
    setWitnesses(updatedWitnesses);
  };
  

  const handleAoaTableSelectChange = (e) => {
    const newTable = e.target.value;
    saveCurrentAoaDescription(); // Save data related to the old table first
    setAoaTableSelect(newTable);
    setAoaTableDescription(tableDescriptions[newTable]); 
    setEditedAoaData([]); // Clear edits as they are specific to the table
    setActiveAoaTab("aoa-final-tab"); // Reset to final tab
    // setCurrentAoaRowIndex will be handled by useEffect [currentCard, aoaTableSelect]
    // which calls displaySingleAoaRow(0) or similar.
    // Explicitly setting to -1 then letting useEffect handle it:
    setCurrentAoaRowIndex(-1); 
  };

  
  const renderCardContent = () => {
    switch (currentCard) {
      case 1:
        return (
          <div
            id="page1Content"
            className="page-content active"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div className="e-moa-form-fixed mb-3">
              <form id="moaFormPage1">
                <div className="no-left-padding">
                <div className="row g-3 align-items-center">
                  <div className="col-md-4">
                    <label
                      htmlFor="moaTableSelectP1"
                      className="form-label form-label-sm"
                    >
                      Applicable Table<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-sm"
                      id="moaTableSelectP1"
                  
                      required
                      value={moaTableSelect}
                      onChange={(e) => setMoaTableSelect(e.target.value)}
                    >
                      {moaTableOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label
                      htmlFor="moaCompanyNameP1"
                      className="form-label form-label-sm"
                    >
                      Company Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="moaCompanyNameP1"
                      disabled
                      required
                      value={moaCompanyName}
                      onChange={(e) => setMoaCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label
                      htmlFor="moaStateOfficeP1"
                      className="form-label form-label-sm"
                    >
                      Registered office: State of
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="moaStateOfficeP1"
                      disabled
                      value={moaStateOffice}
                    />
                  </div>
                </div>
                </div>
              </form>
            </div>
            <div className="e-moa-meta-fixed mb-2" id="moaMetaDisplayP1">
              <div
                className="moa-meta-details"
                style={{ fontWeight: 400, fontSize: "0.8rem" }}
              >
                {
                  <span>
                    3(a) The objects to be pursued by the company on its
                    incorporation are
                  </span>
                }
              </div>
              <div className="moa-meta-tabs ms-auto">
                <ul className="nav nav-pills nav-pills-sm" role="tablist">
                  <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeMoaTab === "moa-generate-tab" ? "active" : ""}`}
                    id="moa-generate-tab-p1"
                    type="button"
                    role="tab"
                    onClick={() => {
                      activateMoaTab("moa-generate-tab");
                      generateMoaObjects(); 
                    }}
                    aria-selected={activeMoaTab === "moa-generate-tab"}
                   >
                    <i className="bi bi-magic"></i> Generate
                  </button>

                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeMoaTab === "moa-final-tab" ? "active" : ""
                      }`}
                      id="moa-final-tab-p1"
                      type="button"
                      role="tab"
                      onClick={() => activateMoaTab("moa-final-tab")}
                      aria-selected={activeMoaTab === "moa-final-tab"}
                    >
                      <i className="bi bi-pencil-square"></i> Final
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeMoaTab === "moa-template-tab" ? "active" : ""
                      }`}
                      id="moa-template-tab-p1"
                      type="button"
                      role="tab"
                      onClick={() => activateMoaTab("moa-template-tab")}
                      aria-selected={activeMoaTab === "moa-template-tab"}
                    >
                      <i className="bi bi-file-text"></i> Template
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="moa-content-area d-flex flex-column"
              style={{
                flexGrow: 1,
                overflowY: "hidden",
                position: "relative",
                padding: "0 1rem 1rem 1rem",
              }}
            >
              {activeMoaTab === "moa-template-tab" && (
                <div className="tab-pane fade show active h-100">
                  <embed
                    src={eMoAPDF}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ minHeight: "500px" }}
                  />
                </div>
              )}
              {activeMoaTab === "moa-generate-tab" && (
                <div className="tab-pane fade show active d-flex flex-column h-100">
                  <textarea
  value={defaultMoaClause1}
  readOnly
  className="form-control form-control-sm flex-grow-1"
  style={{ resize: 'none', overflowY: 'auto'}}
  placeholder="No default objects defined."
/>

                  <button
                    type="button"
                    className={`btn btn-sm btn-outline-secondary mt-2 align-self-end ${
                      moaClause1Copied ? "copied-btn" : ""
                    }`}
                    onClick={() =>
                      copyToClipboard(defaultMoaClause1, setMoaClause1Copied)
                    }
                  >
                    <i
                      className={`bi ${
                        moaClause1Copied ? "bi-check-lg" : "bi-clipboard"
                      }`}
                    ></i>{" "}
                    {moaClause1Copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
              {activeMoaTab === "moa-final-tab" && (
                <div className="tab-pane fade show active h-100">
                  <textarea
  value={moaMainObjectClause1}
  onChange={(e) => setMoaMainObjectClause1(e.target.value)}
  className="form-control form-control-sm h-100"
  style={{ resize: 'none', overflowY: 'auto', minHeight: '300px' }}
  placeholder="Paste copied text here or enter the final main objects..."
/>

                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div
            id="page1Content" // id should be unique, e.g., page2Content
            className="page-content active"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div className="e-moa-form-fixed mb-3">
              <form id="moaFormPage2">
                <div className="no-left-padding">
                <div className="row g-3 align-items-center">
                  <div className="col-md-4">
                    <label
                      htmlFor="moaTableSelectP2"
                      className="form-label form-label-sm"
                    >
                      Applicable Table<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-sm"
                      id="moaTableSelectP2"
                      required
                      value={moaTableSelect}
                      onChange={(e) => setMoaTableSelect(e.target.value)}
                    >
                      {moaTableOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label
                      htmlFor="moaCompanyNameP2"
                      className="form-label form-label-sm"
                    >
                      Company Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="moaCompanyNameP2"
                      required
                      disabled
                      value={moaCompanyName}
                      onChange={(e) => setMoaCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label
                      htmlFor="moaStateOfficeP2"
                      className="form-label form-label-sm"
                    >
                      Registered office: State of
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="moaStateOfficeP2"
                      disabled
                      value={moaStateOffice}
                    />
                  </div>
                </div>
                </div>
              </form>
            </div>
            <div className="e-moa-meta-fixed mb-2" id="moaMetaDisplayP2">
              <div
                className="moa-meta-details"
                style={{ fontWeight: 400, fontSize: "0.8rem" }}
              >
                <span>
                  3(b) Matters which are necessary for furtherance of the
                  objects specified in clause 3(a) are
                  <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                </span>
              </div>

              <div className="moa-meta-tabs ms-auto">
                <ul className="nav nav-pills nav-pills-sm" role="tablist">
                  
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeMoaTab === "moa-generate-tab" ? "active" : ""
                      }`}
                      id="moa-generate-tab-p2"
                      type="button"
                      role="tab"
                      onClick={() => activateMoaTab("moa-generate-tab")}
                      aria-selected={activeMoaTab === "moa-generate-tab"}
                    >
                      <i className="bi bi-magic"></i> Generate
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeMoaTab === "moa-final-tab" ? "active" : ""
                      }`}
                      id="moa-final-tab-p2"
                      type="button"
                      role="tab"
                      onClick={() => activateMoaTab("moa-final-tab")}
                      aria-selected={activeMoaTab === "moa-final-tab"}
                    >
                      <i className="bi bi-pencil-square"></i> Final
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeMoaTab === "moa-template-tab" ? "active" : ""
                      }`}
                      id="moa-template-tab-p2"
                      type="button"
                      role="tab"
                      onClick={() => activateMoaTab("moa-template-tab")}
                      aria-selected={activeMoaTab === "moa-template-tab"}
                    >
                      <i className="bi bi-file-text"></i> Template
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="moa-content-area d-flex flex-column"
              style={{
                flexGrow: 1,
                overflowY: "hidden",
                position: "relative",
                padding: "0 1rem 1rem 1rem",
              }}
            >
              {activeMoaTab === "moa-template-tab" && (
                <div className="tab-pane fade show active h-100">
                  <embed
                    src={eMoAPDF}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ minHeight: "500px" }}
                  />
                </div>
              )}
              {activeMoaTab === "moa-generate-tab" && (
                <div className="tab-pane fade show active d-flex flex-column h-100">
                  <MoaClauseDisplay
                    content={defaultMoaClause2}
                    editable={false}
                    className="flex-grow-1"
                    placeholder="No default ancillary objects defined."
                  />
                  <button
                    type="button"
                    className={`btn btn-sm btn-outline-secondary mt-2 align-self-end ${
                      moaClause2Copied ? "copied-btn" : ""
                    }`}
                    onClick={() =>
                      copyToClipboard(defaultMoaClause2, setMoaClause2Copied)
                    }
                  >
                    <i
                      className={`bi ${
                        moaClause2Copied ? "bi-check-lg" : "bi-clipboard"
                      }`}
                    ></i>{" "}
                    {moaClause2Copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
              {activeMoaTab === "moa-final-tab" && (
                <div className="tab-pane fade show active h-100">
                   <textarea
      value={moaMainObjectClause2} // Correct: Reads from state
      onChange={(e) => setMoaMainObjectClause2(e.target.value)} // Correct: Updates state
      className="form-control form-control-sm h-100" // Assuming similar classes
      style={{ resize: 'none', overflowY: 'auto', minHeight: '300px' }} // Assuming similar styles
      placeholder="Paste copied text here or enter the final ancillary objects..."
    />
  </div>
)}
            </div>
          </div>
        );

      case 3:
        return (
          <div
            id="page3Content"
            className="page-content active"
            style={{
              padding: "0 1rem 1rem 1rem",
              overflowY: "auto",
              fontSize: "0.9rem",
            }}
          >
            <p className="mb-1">
              <strong>4.</strong> The liability of the member(s) is limited, and
              this liability is limited to the amount unpaid if any, on the
              shares held by them.
            </p>
            <div className="mb-3">
  <p><strong>5. Every member of the company undertakes to contribute:</strong></p>
  
  <p style={{ paddingLeft: "1rem" }}>
    (i) to the assets of the company in the event of its being wound up while he is a member, or within one year after he ceases to be a member, for payment of the debts and liabilities of the company or of such debts and liabilities as may have been contracted before he ceases to be a member; and
  </p>

  <p style={{ paddingLeft: "1rem" }}>
    (ii) to the costs, charges and expenses of winding up (and for the adjustment of the rights of the contributories among themselves), such amount as may be required, not exceeding
    <input
      type="text"
      className="form-control d-inline-block ms-2 me-2"
      style={{ width: "150px", display: "inline-block" }}
      placeholder="Rupees"
      value={contributionLimit}
      onChange={(e) => setContributionLimit(e.target.value)}
    /> rupees.
  </p>

  <p style={{ paddingLeft: "1rem", marginBottom: "0.5rem" }}>
    (iii) The share capital of the company is
    <input
      type="text"
      className="form-control d-inline-block ms-2"
      style={{ width: "200px", display: "inline-block" }}
      value={shareCapitalAmount}
      onChange={(e) => setShareCapitalAmount(e.target.value)}
    /> rupees, divided into:
  </p>

<div className="table-responsive mt-2">

  <table className="table table-bordered text-center align-middle" style={{ maxWidth: "100%" }}>
    <tbody>
      <tr style={{ background: "#e9ecf7" }}>
        <td style={{ width: "25%" }}>
          <input
            type="text"
            className="form-control text-center"
            value={numberOfShares}
            onChange={(e) => setNumberOfShares(e.target.value)}
            placeholder="No. of Shares"
          />
        </td>
        <td style={{ width: "15%" }}>
             <select 
                className="form-select text-center"
                value={shareType}
                onChange={(e) => setShareType(e.target.value)}
             >
                <option value="Equity Share">Equity Share</option>
                <option value="Preference Share">Preference Share</option>
             </select>
        </td>
        <td style={{ width: "15%" }}>Shares of</td>
        <td style={{ width: "25%" }}>
          <input
            type="text"
            className="form-control text-center"
            value={shareValue}
            onChange={(e) => setShareValue(e.target.value)}
            placeholder="₹ Value"
          />
        </td>
        <td style={{ width: "15%" }}>Rupees each</td>
      </tr>
    </tbody>
  </table>
</div>

</div>

            <p className="mb-1 mt-3">
  <strong>6.</strong>
</p>
<div className="form-check mb-2">
  <input className="form-check-input" type="radio" name="clause6Option" id="clause6Option1" value="option1" checked={clause6Option === "option1"} onChange={(e) => setClause6Option(e.target.value)} />
  <label className="form-check-label" htmlFor="clause6Option1">
    We, the several persons, whose names and address are subscribed, are desirous of being formed into a company
    in pursuance of this memorandum of association, and we respectively agree to take the number of shares in
    the capital of the company set against our respective names:
  </label>
</div>
<div className="form-check mb-2">
  <input className="form-check-input" type="radio" name="clause6Option" id="clause6Option2" value="option2" checked={clause6Option === "option2"} onChange={(e) => setClause6Option(e.target.value)} />
  <label className="form-check-label" htmlFor="clause6Option2">
    I, whose name and address is given below, am desirous of forming a company in pursuance of this memorandum
    of association and agree to take all the shares in the capital of the company:
  </label>
</div>
<div className="form-check mb-2">
  <input className="form-check-input" type="radio" name="clause6Option" id="clause6Option3" value="option3" checked={clause6Option === "option3"} onChange={(e) => setClause6Option(e.target.value)} />
  <label className="form-check-label" htmlFor="clause6Option3">
    We, the several persons, whose names and addresses are subscribed, are desirous of being formed into a company
    in pursuance of this memorandum of association:
  </label>
</div>

          </div>
        );

      case 4:
        const totalEquityShares = subscribers.reduce(
          (sum, sub) => sum + (parseInt(sub.shares, 10) || 0),
          0
        );
        const totalPreferenceShares = subscribers.reduce(
          (sum, sub) => sum + (parseInt(sub.preference, 10) || 0),
          0
        );
        return (
          <div
            id="page4Content"
            style={{ overflowX: "auto", padding: "0 1rem 1rem 1rem" }}
          >
            <h6 className="mb-3">Subscriber Details</h6>
            <fieldset disabled style={{ opacity: 0.8 }}>

            <table
              className="table table-bordered align-middle table-sm moa-aoa-table"
              id="subscriberTable"
            >
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: "5%", textAlign: "center" }}>
                    S. No.
                  </th>
                  <th scope="col" style={{ width: "30%" }}>
                    <span className="text-danger">*</span>Name, Address,
                    Description and Occupation
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    <span className="text-danger">*</span>DIN / PAN / Passport
                    number
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>No. of shares taken
                    (Equity, Preference)
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>DSC
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>Dated
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber, index) => (
                  <tr key={subscriber.id}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td>
                      <textarea
                        className="form-control form-control-sm border-0"
                        rows="4"
                        value={subscriber.bio}
                        onChange={(e) =>
                          handleSubscriberChange(index, "bio", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm border-0"
                        value={subscriber.dinPan}
                        onChange={(e) =>
                          handleSubscriberChange(
                            index,
                            "dinPan",
                            e.target.value
                          )
                        }
                        required
                      />
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <input
                          type="number"
                          className="form-control form-control-sm border-0 mb-1"
                          placeholder="Equity"
                          value={subscriber.shares}
                          onChange={(e) =>
                            handleSubscriberChange(
                              index,
                              "shares",
                              e.target.value
                            )
                          }
                          required
                          min="0"
                        />
                        <input
                          type="number"
                          className="form-control form-control-sm border-0"
                          placeholder="Preference"
                          value={subscriber.preference}
                          onChange={(e) =>
                            handleSubscriberChange(
                              index,
                              "preference",
                              e.target.value
                            )
                          }
                          required
                          min="0"
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm border-0"
                        value={subscriber.dsc}
                        readOnly
                        placeholder="DSC status"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-control form-control-sm border-0"
                        value={subscriber.date}
                        onChange={(e) =>
                          handleSubscriberChange(index, "date", e.target.value)
                        }
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-center fw-bold">
                    Total shares taken
                  </td>
                  <td colSpan="3">
                    <input
                      type="text"
                      className="form-control form-control-sm border-0 fw-bold"
                      value={`${totalEquityShares} Equity, ${totalPreferenceShares} Preference`}
                      readOnly
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
            </fieldset>
            <small className="text-muted">
              *Ensure total shares taken match the capital structure defined in
              Clause 5.
            </small>
          </div>
        );

      case 5:
        return (
          <div
            id="page5Content"
            style={{ overflowX: "auto", padding: "1.5rem" }}
          >
            <h6 className="mb-3">Signed before me (Witness Details)</h6>
            <table
              className="table table-bordered align-middle table-sm moa-aoa-table"
              id="witnessTable"
            >
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: "15%" }}>
                    Membership type
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>Name
                  </th>
                  <th scope="col" style={{ width: "25%" }}>
                    <span className="text-danger">*</span>Address, Description &
                    Occupation
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    <span className="text-danger">*</span>
                    DIN/PAN/Passport/Membership no.
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>DSC
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    <span className="text-danger">*</span>Dated
                  </th>
                </tr>
              </thead>
              <tbody>
                {witnesses
                  .filter((_, index) => index !== 1) // Filter out the second witness if it's a placeholder
                  .map((witness, index) => (
                    <tr key={witness.id}>
                       <td>
                         <input 
                            type="text"
                            className="form-control form-control-sm border-0"
                            value={witness.type || "ACA"} // Default to ACA if not specified
                            onChange={(e) => handleWitnessChange(index, "type", e.target.value)}
                         />
                       </td>

                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm border-0"
                          value={witness.name}
                          onChange={(e) =>
                            handleWitnessChange(index, "name", e.target.value)
                          }
                          required={index === 0} // Assuming first witness is always required
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control form-control-sm border-0"
                          rows="4"
                          value={witness.addressDesc}
                          onChange={(e) =>
                            handleWitnessChange(
                              index,
                              "addressDesc",
                              e.target.value
                            )
                          }
                          required={index === 0}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm border-0"
                          value={witness.idNumber}
                          onChange={(e) =>
                            handleWitnessChange(
                              index,
                              "idNumber",
                              e.target.value
                            )
                          }
                          required={index === 0}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm border-0"
                          value={witness.dsc}
                          readOnly // Assuming DSC is auto-filled or read-only
                          placeholder="DSC status"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control form-control-sm border-0"
                          value={witness.date}
                          onChange={(e) =>
                            handleWitnessChange(index, "date", e.target.value)
                          }
                          required={index === 0}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <small className="text-muted">
              *At least one witness is required.
            </small>
          </div>
        );

    case 6:
  // Hide Nominee Details if Table A is selected or other non-OPC tables
    if (shouldSkipPage6) return (
        <div style={{ padding: "1.5rem 2rem", fontSize: "0.95rem", lineHeight: 1.8, textAlign: 'center' }}>
            <p className="text-muted">Nominee details are not applicable for the selected MoA Table ({moaTableSelect}).</p>
        </div>
    );


  return (
    <div
      id="page6Content"
      style={{
        padding: "1.5rem 2rem",
        fontSize: "0.95rem",
        lineHeight: 1.8,
      }}
    >
      <h6 className="mb-3">
        7. Nominee Details (In case of One Person Company)
      </h6>
      <p className="text-muted small mb-3">
        This section is applicable only if the company being incorporated is a One Person Company (OPC).
      </p>

      <div className="row mb-3 align-items-center">
        <div className="col-auto">
          <label htmlFor="nomineeName" className="form-label mb-0 me-1">
            I, Shri / Smt.
          </label>
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control form-control-sm"
            id="nomineeName"
            placeholder="Nominee's Name"
            value={nomineeName}
            onChange={(e) => setNomineeName(e.target.value)}
          />
        </div>
        <div className="col-auto ps-md-2">
          <label htmlFor="nomineeParentName" className="form-label mb-0">
            S/o / D/o / W/o
          </label>
        </div>
      </div>

      <div className="row mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm"
            id="nomineeParentName"
            placeholder="Father's/Mother's/Husband's Name"
            value={nomineeParentName}
            onChange={(e) => setNomineeParentName(e.target.value)}
          />
        </div>
        <div className="col-auto ps-md-2">
          <label htmlFor="nomineeAddress" className="form-label mb-0 me-1">
            resident of
          </label>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm"
            id="nomineeAddress"
            placeholder="Nominee's Address"
            value={nomineeAddress}
            onChange={(e) => setNomineeAddress(e.target.value)}
          />
        </div>
        <div className="col-auto ps-md-2">
          <label htmlFor="nomineeAge" className="form-label mb-0 me-1">
            aged
          </label>
        </div>
        <div className="col-md-1">
          <input
            type="number"
            className="form-control form-control-sm"
            id="nomineeAge"
            placeholder="Age"
            value={nomineeAge}
            onChange={(e) => setNomineeAge(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <span>years</span>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <span>
            shall be the nominee in the event of death of the sole member.
          </span>
        </div>
      </div>
    </div>
  );


      case 7:
        const activeData = getActiveAoaData();
        const currentArticleData =
          currentAoaRowIndex >= 0 && currentAoaRowIndex < activeData.length
            ? activeData[currentAoaRowIndex]
            : null;
        const showAoaFooterControls =
          currentAoaRowIndex >= 0 &&
          activeData.length > 0 &&
          activeAoaTab !== "aoa-template-tab";
        const aoaTemplateToShow = aoaTableSelect === "H" ? eAoAPDF_H : eAoAPDF;
        const aoaGenerateText = currentArticleData ? getAoaTemplateText(currentArticleData) : "";
        const canCopy = !!aoaGenerateText;

        return (
          <div
            id="page7Content"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div className="e-aoa-form-fixed mb-3">
              <form id="aoaFormPage7">
                <div className="no-left-padding">
                <div className="row g-3 align-items-center">
                  <div className="col-12 col-md-3 mb-2 mb-md-0">
                    <label
                      htmlFor="aoaTableSelectP7"
                      className="form-label form-label-sm"
                    >
                      Applicable Table<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-sm"
                      id="aoaTableSelectP7"
                      required
                      value={aoaTableSelect}
                      onChange={handleAoaTableSelectChange}
                    >
                      <option value="F">F</option>
                      <option value="G">G</option>
                      <option value="H">H</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4 mb-2 mb-md-0">
                    <label
                      htmlFor="aoaTableDescriptionInputP7"
                      className="form-label form-label-sm"
                    >
                      Table Description
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="aoaTableDescriptionInputP7"
                      readOnly
                      value={getAoaTableDescription(aoaTableSelect)} // Use function for direct value
                    />
                  </div>
                  <div className="col-12 col-md-5 mb-2 mb-md-0">
                    <label
                      htmlFor="aoaCompanyNameP7"
                      className="form-label form-label-sm"
                    >
                      Company Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="aoaCompanyNameP7"
                      required
                      value={aoaCompanyName} // This should be InitCapped
                      onChange={(e) => setAoaCompanyName(toInitCap(e.target.value))} // Ensure InitCap on change
                      disabled // Typically disabled if pre-filled
                    />
                  </div>
                </div>
                </div>
              </form>
            </div>
            {currentArticleData && (
              <div className="e-aoa-meta-fixed mb-2" id="aoaMetaDisplayP7">
                <div className="aoa-meta-details small flex-grow-1">
                  <span>
                    <strong>Part:</strong> {currentArticleData.part || "N/A"}
                  </span>
                  <span className="mx-2 d-none d-sm-inline">|</span>
                  <span className="d-block d-sm-inline">
                    <strong>Article:</strong>{" "}
                    {currentArticleData.article || "N/A"}
                  </span>
                  <span className="mx-2 d-none d-sm-inline">|</span>
                  <span className="d-block d-sm-inline">
                    <strong>Section:</strong>{" "}
                    {currentArticleData.section || "N/A"}
                  </span>
                </div>
                <div className="aoa-meta-tabs ms-auto">
                  <ul
                    className="nav nav-pills nav-pills-sm"
                    id="aoaArticleTabsListP7"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeAoaTab === "aoa-template-tab" ? "active" : ""
                        }`}
                        id="aoa-template-tab-btn"
                        type="button"
                        onClick={() => activateAoaTab("aoa-template-tab")}
                      >
                        <i className="bi bi-file-text"></i> Template
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeAoaTab === "aoa-generate-tab" ? "active" : ""
                        }`}
                        id="aoa-generate-tab-btn"
                        type="button"
                        onClick={() => activateAoaTab("aoa-generate-tab")}
                      >
                        <i className="bi bi-magic"></i> Generate
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeAoaTab === "aoa-final-tab" ? "active" : ""
                        }`}
                        id="aoa-final-tab-btn"
                        type="button"
                        onClick={() => activateAoaTab("aoa-final-tab")}
                      >
                        <i className="bi bi-pencil-square"></i> Final
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {(currentAoaRowIndex < 0 || activeData.length === 0) && (
              <div className="p-3 text-center text-muted border rounded bg-light h-100 d-flex align-items-center justify-content-center flex-grow-1">
                {activeData.length === 0 ? (
                  <p>
                    No articles available for the selected Table (
                    {aoaTableSelect}).
                  </p>
                ) : (
                  <p>
                    Select an applicable Table and Company Name above. Articles
                    will load here.
                  </p>
                )}
              </div>
            )}

            <div
              className="aoa-content-area"
              style={{
                flexGrow: 1,
                overflow: "hidden",
                position: "relative",
                display: currentArticleData ? "flex" : "none",
                flexDirection: "column",
              }}
            >
              {activeAoaTab === "aoa-template-tab" && currentArticleData && (
                <div
                  id="templateContentPaneAoa"
                  className="tab-pane fade show active h-100"
                >
                  <embed
                    src={aoaTemplateToShow}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ minHeight: "500px" }}
                  />
                </div>
              )}
              {activeAoaTab === "aoa-generate-tab" && currentArticleData && (
                <div
                  className="e-aoa-description-scroll-container tab-pane fade show active"
                  id="aoaGenerateTextareaContainer"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MoaClauseDisplay
                    content={aoaGenerateText} // Uses getAoaTemplateText with current aoaCompanyName
                    editable={false}
                    className="flex-grow-1"
                    placeholder="Generated AOA article description will appear here."
                  />
                </div>
              )}
              {activeAoaTab === "aoa-final-tab" && currentArticleData && (
                <div
                  className="e-aoa-description-scroll-container tab-pane fade show active"
                  id="aoaFinalTextareaContainer"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MoaClauseDisplay
                    content={aoaDescriptionText} // State holding current text for "Final" tab
                    editable={true}
                    onChange={setAoaDescriptionText}
                    className="flex-grow-1"
                    placeholder="Paste generated text here or enter/edit the final AOA article description..."
                  />
                </div>
              )}
            </div>

            {currentArticleData && (
              <div
                className={`navigation-buttons-aoa mt-auto border-top pt-2 pb-2 flex-shrink-0 ${ // Added pt-2 pb-2 for padding
                  activeAoaTab === "aoa-template-tab" ? "template-active" : ""
                }`}
              >
                <div className="aoa-footer-left">
                  <button
                    type="button"
                    className={`btn btn-outline-secondary btn-sm aoa-copy-footer-btn ${
                      aoaFooterCopied ? "copied-btn" : ""
                    }`}
                    onClick={copyAoaGenerateArticleForFooter}
                    disabled={!canCopy || activeAoaTab === "aoa-template-tab"}
                    title={
                      activeAoaTab === "aoa-template-tab"
                        ? "Switch to Generate/Final to enable copy"
                        : canCopy
                        ? "Copy Generated Text"
                        : "No text to copy"
                    }
                  >
                    <i
                      className={`bi ${
                        aoaFooterCopied ? "bi-check-lg" : "bi-clipboard-plus"
                      }`}
                    ></i>
                    <span>{aoaFooterCopied ? " Copied!" : " Copy"}</span>
                  </button>
                </div>

                {activeAoaTab !== "aoa-template-tab" &&
                  activeData.length > 0 && (
                    <div className="aoa-footer-nav-group">
                      <button
                        type="button"
                        className="btn btn-nav btn-sm" // Made sm
                        id="previousAoaFooterBtn"
                        onClick={showPreviousAoaArticle}
                        disabled={currentAoaRowIndex <= 0}
                        title="Previous Article"
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <span
                        className="progress-text mx-2 small" // Made small
                        id="aoaFooterProgressText"
                      >
                        Article{" "}
                        <span className="fw-bold">{currentAoaRowIndex }</span> /{" "} 
                        {activeData.length}
                      </span>
                      <button
                        type="button"
                        className="btn btn-nav btn-sm" // Made sm
                        id="nextAoaFooterBtn"
                        onClick={showNextAoaArticle}
                        disabled={currentAoaRowIndex >= activeData.length - 1}
                        title="Next Article"
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  )}

                {activeAoaTab === "aoa-template-tab" && (
                  <div className="aoa-footer-nav-placeholder text-muted small">
                    Switch to 'Generate' or 'Final' tab to navigate articles.
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 8:
        // This is AoA Subscriber Details, similar to MoA Card 4 but for AoA
        // Ensure data source is `subscribers` (assuming same for MoA & AoA)
        return (
          <div
            id="page8Content" // Unique ID
            style={{ overflowX: "auto", padding: "0 1rem 1rem 1rem" }}
          >
            <h6 className="mb-3">Subscriber Details (for Articles of Association)</h6>
          <fieldset disabled style={{ opacity: 0.8 }}>
            <table
              className="table table-bordered align-middle table-sm moa-aoa-table"
              id="aoaSubscriberTable" // Unique ID
            >
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: "5%", textAlign: "center" }}>
                    S. No.
                  </th>
                  <th scope="col" style={{ width: "30%" }}>
                    <span className="text-danger">*</span>Name, Address,
                    Description and Occupation
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    <span className="text-danger">*</span>DIN / PAN / Passport
                    number
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>Place
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>DSC
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>Dated
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber, index) => (
                  <tr key={`aoa-sub-${subscriber.id}`}> 
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td>
                      <textarea
                        className="form-control form-control-sm border-0"
                        rows="4"
                        value={subscriber.bio}
                        readOnly // Data is from MoA, so read-only here
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm border-0"
                        value={subscriber.dinPan}
                        readOnly
                      />
                    </td>
                    <td>
                      {/* Assuming Place is pre-filled or dynamically set */}
                      <div className="form-control form-control-sm border-0 mb-1 bg-transparent">
                        Tirupathi {/* Example, should be dynamic or editable if needed */}
                      </div>
                    </td>

                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm border-0"
                        value={subscriber.dsc}
                        readOnly
                        placeholder="DSC status"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-control form-control-sm border-0"
                        value={subscriber.date}
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </fieldset>
          </div>
          
        );

      case 9:
        // This is AoA Witness Details, similar to MoA Card 5 but for AoA
        return (
          <div
            id="page9Content" // Unique ID
            style={{ overflowX: "auto", padding: "1.5rem" }}
          >
            <h6 className="mb-3">Signed before me (Witness for Articles of Association)</h6>
            <table
              className="table table-bordered align-middle table-sm moa-aoa-table"
              id="aoaWitnessTable" // Unique ID
            >
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: "15%" }}>
                    Membership type
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>Name
                  </th>
                  <th scope="col" style={{ width: "25%" }}>
                    <span className="text-danger">*</span>Address, Description &
                    Occupation
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    <span className="text-danger">*</span>
                    DIN/PAN/Passport/Membership no.
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>Place
                  </th>
                  <th scope="col" style={{ width: "15%" }}>
                    <span className="text-danger">*</span>DSC
                  </th>
                  <th scope="col" style={{ width: "10%" }}>
                    <span className="text-danger">*</span>Dated
                  </th>
                </tr>
              </thead>
              <tbody>
                {witnesses // Assuming same witness data can be used or needs separate state
                  .filter((_, index) => index !== 1) 
                  .map((witness, index) => (
                    <tr key={`aoa-wit-${witness.id}`}> {/* Unique key */}
                       <td>
                         <input 
                            type="text"
                            className="form-control form-control-sm border-0"
                            value={witness.type || "ACA"}
                            onChange={(e) => handleWitnessChange(index, "type", e.target.value)} // Or make readOnly if from MoA
                         />
                       </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm border-0"
                          value={witness.name}
                          onChange={(e) => handleWitnessChange(index, "name", e.target.value)}
                          required={index === 0}
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control form-control-sm border-0"
                          rows="4"
                          value={witness.addressDesc}
                          onChange={(e) => handleWitnessChange(index, "addressDesc", e.target.value)}
                          required={index === 0}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm border-0"
                          value={witness.idNumber}
                          onChange={(e) => handleWitnessChange(index, "idNumber", e.target.value)}
                          required={index === 0}
                        />
                      </td>
                      <td>
                        <div className="form-control form-control-sm border-0 mb-1 bg-transparent">
                          Bengaluru {/* Example, should be dynamic or editable */}
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm border-0"
                          value={witness.dsc}
                          readOnly
                          placeholder="DSC status"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control form-control-sm border-0"
                          value={witness.date}
                          onChange={(e) => handleWitnessChange(index, "date", e.target.value)}
                          required={index === 0}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

const generateMoaObjects = async () => {
  try {
    setIsGenerating(true); 

    const response = await fetch("http://3.111.226.182/factops/coform/generateMOA", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ org_id: orgId }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const result = await response.json();
    const data = result.data;

    const clause1 = data.objectives_primary || "";
    const clause2 = data.objectives_secondary || "";

    setDefaultMoaClause1(clause1);
    setDefaultMoaClause2(clause2);
    // Also pre-fill final tabs if they are empty
    if (!moaMainObjectClause1.trim()) setMoaMainObjectClause1(clause1);
    if (!moaMainObjectClause2.trim()) setMoaMainObjectClause2(clause2);


    console.log("✅ MOA Clause 3(a) generated:\n", clause1);
    console.log("✅ MOA Clause 3(b) generated:\n", clause2);

  } catch (error) {
    console.error("❌ Error generating MOA:", error);
  } finally {
    setIsGenerating(false); 
  }
};


const transformDirectorData = (dirInfo) => {
  if (!Array.isArray(dirInfo)) return [];
  return dirInfo.map((director, idx) => {
    const address = director.address || {};
    return {
      id: idx + 1, // Or use a more unique ID if available from director
      bio: `${director.name || ''}\n${address.pe_line1 || ''}${address.pe_line2 ? ', ' + address.pe_line2 : ''}\n${address.pe_city || ''}, ${address.pe_state_or_ut || ''}, ${address.pe_country || ''} - ${address.pe_pin_code || ''}\nOccupation: ${director.occupation || ''}`,
      dinPan: director.DIN || director.pan_number || '', // Use DIN or PAN
      shares: '',            
      preference: '',        
      dsc: director.dsc_status || 'Not Available', // Assuming dsc_status might come
      date: director.incorporation_date || new Date().toISOString().split('T')[0], // Example date
    };
  });
};


  useEffect(() => {
    const fetchMoaData = async () => {
  
      try {
        const response = await fetch('http://3.111.226.182/factops/coform/getMOA', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ org_id: orgId })
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const result = await response.json();
        console.log(' MOA fetched:', result.data);
  
        if (result.status === 'success' && result.data) {
          const { section_3A, section_3B, application_table,dir_info} = result.data;
  
          setDefaultMoaClause1(section_3A ? section_3A.trim() : "");
          setMoaMainObjectClause1(section_3A ? section_3A.trim() : "");
  
          setDefaultMoaClause2(section_3B ? section_3B.trim() : "");
          setMoaMainObjectClause2(section_3B ? section_3B.trim() : "");
  
          setMoaTableSelect(application_table || 'A');
          if (result.org_name) {
            setMoaCompanyName(result.org_name.trim());
            // Initialize AoA company name if it's not already set by AoA fetch
             if (!aoaCompanyName) setAoaCompanyName(toInitCap(result.org_name.trim()));
          } 
          if (result.registered_office) {
            setMoaStateOffice(result.registered_office.trim());
          } 
          if (dir_info?.length > 0) {
            const formattedSubscribers = transformDirectorData(dir_info);
            console.log("✅ Transformed Subscribers from MOA get:", formattedSubscribers);
            setSubscribers(formattedSubscribers);
          }
        }
      } catch (error) {
        console.error(' Error fetching MOA data:', error);
      }
    };
  
    fetchMoaData();
  }, [orgId, token]); // Add dependencies orgId, token

useEffect(() => { 
  const fetchAoaData = async () => {
    try {
      const response = await fetch('http://3.111.226.182/factops/coform/getAOA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ org_id: orgId })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ AOA fetched:', result.data); 

      if (result.status === 'success' && result.data) {
        const data = result.data;

        // Prefer AoA fetched name, but keep existing if already set (e.g. by MoA fetch)
        if (data.company_name) {
            setAoaCompanyName(toInitCap(data.company_name));
        } else if (!aoaCompanyName && moaCompanyName) { // If AoA name missing, fallback to MoA name
            setAoaCompanyName(toInitCap(moaCompanyName));
        }


        setAoaTableSelect(data.applicable_table || 'F'); // Default to F if not provided
        setAoaTableDescription(getAoaTableDescription(data.applicable_table || 'F'));


        // Logic to transform API response (data.article1, data.article2_1 etc.) 
        // back into editedAoaData format if needed for pre-filling edits.
        const fetchedEdits = [];
        const activeSchema = (data.applicable_table === "H" ? sampleAoAData_H : sampleAoaData);

        activeSchema.forEach(schemaItem => {
            let apiKey;
            if (schemaItem.part === "I" && schemaItem.section === "Interpretation") {
                apiKey = "article1";
            } else if (schemaItem.part === "II" && schemaItem.article && String(schemaItem.article).trim() !== "") {
                apiKey = `article2_${String(schemaItem.article).replace(/\./g, "_")}`;
            }

            if (apiKey && data[apiKey] && typeof data[apiKey].description === 'string') {
                const fetchedArticleData = data[apiKey];
                const templateTextForThisArticle = getAoaTemplateText({ // Construct temp article data for getAoaTemplateText
                    ...schemaItem, 
                    // Ensure getAoaTemplateText has access to the correct company name if it relies on state
                    // by temporarily setting aoaCompanyName if it's part of data.company_name for this call
                });

                // Add to editedAoaData only if fetched description is different from template and not empty
                if (fetchedArticleData.description.trim() !== "" && fetchedArticleData.description !== templateTextForThisArticle) {
                    fetchedEdits.push({
                        part: schemaItem.part,
                        article: schemaItem.article,
                        section: schemaItem.section,
                        description: fetchedArticleData.description,
                        // check_if_altered: fetchedArticleData.check_if_altered, // If API sends this
                        // check_if_not_applicale: fetchedArticleData.check_if_not_applicale // If API sends this
                    });
                }
            }
        });
        if (fetchedEdits.length > 0) {
            setEditedAoaData(fetchedEdits);
            console.log("✅ Populated editedAoaData from fetched AOA:", fetchedEdits);
        }

      }
    } catch (error) {
      console.error('❌ Error fetching AOA data:', error);
    }
  };

  fetchAoaData();
}, [orgId, token, moaCompanyName]); // Add moaCompanyName as dep for fallback

  

return (
  <div className="card-layout-wrapper">
    {isGenerating && (
      <div className="moa-loading-overlay">
        <div className="moa-loading-card">
          <div className="upload-icon mb-3">
            <i className="bi bi-gear-fill spin-icon"></i>
          </div>
          <h4 className="gradient-text">Generating...</h4>
          <h6>Please wait while we generate the data</h6>
        </div>
      </div>
    )}

    <CardLayout
      title={
        currentCard >= 7
          ? "e-Articles of Association (e-AoA)"
          : "e-Memorandum of Association (e-MoA)"
      }
      currentCard={currentCard}
      totalCards={totalCards}
      onNext={handleNext}
      onPrev={handlePrev}
      onPageChange={handlePageChange}
      onFinalSubmit={() => navigate("/inc-9")} // Or your final submission logic
    >
      {renderCardContent()}
    </CardLayout>
  </div>
);
}
