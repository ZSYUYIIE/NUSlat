"use client";

import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PhoneticAppendix({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 max-h-[80vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold">Appendix: Phonetic Transcription</h3>
          <button
            onClick={onClose}
            aria-label="Close appendix"
            className="ml-auto rounded bg-[#f2f6ef] px-3 py-1 text-sm font-semibold"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-8 text-[15px] leading-relaxed thai-char">
          <p>
            The use of phonetic transcription in this book follows the system
            adopted by J Marvin Brown in A.U.A. Thai Course series. The
            following explanation is adapted from the A.U.A Thai Course Book 1,
            page xxii-xxiii.
          </p>

          <section className="space-y-3">
            <h4 className="text-lg font-bold">Vowels</h4>
            <p>
              There are nine simple vowels, or monophthongs, in Standard Thai.
              Their phonetic symbols are presented in Table A below.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-center">
                <caption className="caption-top py-2 text-lg font-bold">
                  Table A: Thai simple vowels
                </caption>
                <thead>
                  <tr>
                    <th className="border border-black px-3 py-2">Phonetic<br />symbol</th>
                    <th className="border border-black px-3 py-2">As in the word</th>
                    <th className="border border-black px-3 py-2">Phonetic<br />symbol</th>
                    <th className="border border-black px-3 py-2">As in the word</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">a</td>
                    <td className="border border-black px-3 py-2">father</td>
                    <td className="border border-black px-3 py-2 font-bold">ɔ</td>
                    <td className="border border-black px-3 py-2">top</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">e</td>
                    <td className="border border-black px-3 py-2">café</td>
                    <td className="border border-black px-3 py-2 font-bold">ʉ</td>
                    <td className="border border-black px-3 py-2">(pronounced like u with a smile) sit</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">i</td>
                    <td className="border border-black px-3 py-2">machine</td>
                    <td className="border border-black px-3 py-2 font-bold">ɛ</td>
                    <td className="border border-black px-3 py-2">cat</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">o</td>
                    <td className="border border-black px-3 py-2">home</td>
                    <td className="border border-black px-3 py-2 font-bold">ə</td>
                    <td className="border border-black px-3 py-2">(pronounced like o with a smile) mallet</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">u</td>
                    <td className="border border-black px-3 py-2">rude</td>
                    <td className="border border-black px-3 py-2" />
                    <td className="border border-black px-3 py-2" />
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              These vowels can occur alone or followed by the same vowel, or
              followed by another vowel. When simple vowels are followed by the
              same vowel, they become long vowels (like aa). When they are
              followed by another vowel, they become diphthongs (like ia).
              Tables B and C contain examples of Thai words with all the vowels.
            </p>

            <div className="overflow-x-auto">
              <table className="mx-auto w-full max-w-3xl border-collapse border border-black text-center">
                <caption className="caption-top py-2 text-lg font-bold">
                  Table B: Short and long vowels
                </caption>
                <thead>
                  <tr>
                    <th className="border border-black px-3 py-2">Vowel</th>
                    <th className="border border-black px-3 py-2">Thai</th>
                    <th className="border border-black px-3 py-2">Meaning</th>
                    <th className="border border-black px-3 py-2">Vowel</th>
                    <th className="border border-black px-3 py-2">Thai</th>
                    <th className="border border-black px-3 py-2">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">i</td>
                    <td className="border border-black px-3 py-2">sip</td>
                    <td className="border border-black px-3 py-2">ten</td>
                    <td className="border border-black px-3 py-2 font-bold">ii</td>
                    <td className="border border-black px-3 py-2">thii</td>
                    <td className="border border-black px-3 py-2">time</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">e</td>
                    <td className="border border-black px-3 py-2">phèt</td>
                    <td className="border border-black px-3 py-2">hot, spicy</td>
                    <td className="border border-black px-3 py-2 font-bold">ee</td>
                    <td className="border border-black px-3 py-2">lêek</td>
                    <td className="border border-black px-3 py-2">number 3</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ɛ</td>
                    <td className="border border-black px-3 py-2">mɛ̀m</td>
                    <td className="border border-black px-3 py-2">Ma'am</td>
                    <td className="border border-black px-3 py-2 font-bold">ɛɛ</td>
                    <td className="border border-black px-3 py-2">khěen</td>
                    <td className="border border-black px-3 py-2">arm</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ʉ</td>
                    <td className="border border-black px-3 py-2">nʉ̀ŋ</td>
                    <td className="border border-black px-3 py-2">one</td>
                    <td className="border border-black px-3 py-2 font-bold">ʉ</td>
                    <td className="border border-black px-3 py-2">mʉʉ</td>
                    <td className="border border-black px-3 py-2">hand</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ɤ</td>
                    <td className="border border-black px-3 py-2">ŋən</td>
                    <td className="border border-black px-3 py-2">money</td>
                    <td className="border border-black px-3 py-2 font-bold">əə</td>
                    <td className="border border-black px-3 py-2">sə̂ə</td>
                    <td className="border border-black px-3 py-2">stupid</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">a</td>
                    <td className="border border-black px-3 py-2">fan</td>
                    <td className="border border-black px-3 py-2">teeth</td>
                    <td className="border border-black px-3 py-2 font-bold">aa</td>
                    <td className="border border-black px-3 py-2">paa</td>
                    <td className="border border-black px-3 py-2">throw</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">u</td>
                    <td className="border border-black px-3 py-2">lúk</td>
                    <td className="border border-black px-3 py-2">rise</td>
                    <td className="border border-black px-3 py-2 font-bold">uu</td>
                    <td className="border border-black px-3 py-2">hŭu</td>
                    <td className="border border-black px-3 py-2">ear</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">o</td>
                    <td className="border border-black px-3 py-2">khon</td>
                    <td className="border border-black px-3 py-2">person</td>
                    <td className="border border-black px-3 py-2 font-bold">oo</td>
                    <td className="border border-black px-3 py-2">soo</td>
                    <td className="border border-black px-3 py-2">starve</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ɔ</td>
                    <td className="border border-black px-3 py-2">lɔ̀n</td>
                    <td className="border border-black px-3 py-2">she</td>
                    <td className="border border-black px-3 py-2 font-bold">ɔɔ</td>
                    <td className="border border-black px-3 py-2">phɔ̂ɔ</td>
                    <td className="border border-black px-3 py-2">father</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="mx-auto w-full max-w-sm border-collapse border border-black text-center">
                <caption className="caption-top py-2 text-lg font-bold">
                  Table C: Diphthongs
                </caption>
                <thead>
                  <tr>
                    <th className="border border-black px-3 py-2">Vowel</th>
                    <th className="border border-black px-3 py-2">Thai</th>
                    <th className="border border-black px-3 py-2">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ia</td>
                    <td className="border border-black px-3 py-2">bia</td>
                    <td className="border border-black px-3 py-2">beer</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">uːa</td>
                    <td className="border border-black px-3 py-2">rua</td>
                    <td className="border border-black px-3 py-2">boat</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">uːa</td>
                    <td className="border border-black px-3 py-2">phůa</td>
                    <td className="border border-black px-3 py-2">husband</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Table D contains Examples of words with the semivowels w and y as
              final consonants.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-center">
                <caption className="caption-top py-2 text-lg font-bold">
                  Table D: Words with final w and y
                </caption>
                <thead>
                  <tr>
                    <th className="border border-black px-3 py-2">Vowel</th>
                    <th className="border border-black px-3 py-2">Thai</th>
                    <th className="border border-black px-3 py-2">Meaning</th>
                    <th className="border border-black px-3 py-2">Vowel</th>
                    <th className="border border-black px-3 py-2">Thai</th>
                    <th className="border border-black px-3 py-2">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">uy</td>
                    <td className="border border-black px-3 py-2">khuy</td>
                    <td className="border border-black px-3 py-2">chat</td>
                    <td className="border border-black px-3 py-2 font-bold">iw</td>
                    <td className="border border-black px-3 py-2">hiw</td>
                    <td className="border border-black px-3 py-2">hungry</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ooy</td>
                    <td className="border border-black px-3 py-2">dooy</td>
                    <td className="border border-black px-3 py-2">with, by</td>
                    <td className="border border-black px-3 py-2 font-bold">ew</td>
                    <td className="border border-black px-3 py-2">rew</td>
                    <td className="border border-black px-3 py-2">fast</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">əːj</td>
                    <td className="border border-black px-3 py-2">nəəy</td>
                    <td className="border border-black px-3 py-2">butter</td>
                    <td className="border border-black px-3 py-2 font-bold">eew</td>
                    <td className="border border-black px-3 py-2">leew</td>
                    <td className="border border-black px-3 py-2">bad</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">oy</td>
                    <td className="border border-black px-3 py-2">thoy</td>
                    <td className="border border-black px-3 py-2">back up</td>
                    <td className="border border-black px-3 py-2 font-bold">ɛw</td>
                    <td className="border border-black px-3 py-2">thew</td>
                    <td className="border border-black px-3 py-2">row</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ɔɔy</td>
                    <td className="border border-black px-3 py-2">rôɔy</td>
                    <td className="border border-black px-3 py-2">100</td>
                    <td className="border border-black px-3 py-2 font-bold">ɛɛn</td>
                    <td className="border border-black px-3 py-2">mɛɛn</td>
                    <td className="border border-black px-3 py-2">cat</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ay</td>
                    <td className="border border-black px-3 py-2">mây</td>
                    <td className="border border-black px-3 py-2">not</td>
                    <td className="border border-black px-3 py-2 font-bold">aw</td>
                    <td className="border border-black px-3 py-2">khâw</td>
                    <td className="border border-black px-3 py-2">enter</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">aay</td>
                    <td className="border border-black px-3 py-2">máay</td>
                    <td className="border border-black px-3 py-2">wood</td>
                    <td className="border border-black px-3 py-2 font-bold">aaw</td>
                    <td className="border border-black px-3 py-2">khâaw</td>
                    <td className="border border-black px-3 py-2">rice</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">iaw</td>
                    <td className="border border-black px-3 py-2">liaw</td>
                    <td className="border border-black px-3 py-2">turn</td>
                    <td className="border border-black px-3 py-2 font-bold">uːaj</td>
                    <td className="border border-black px-3 py-2">nùay</td>
                    <td className="border border-black px-3 py-2">tired</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">uːaj</td>
                    <td className="border border-black px-3 py-2">ruay</td>
                    <td className="border border-black px-3 py-2">rich</td>
                    <td className="border border-black px-3 py-2" />
                    <td className="border border-black px-3 py-2" />
                    <td className="border border-black px-3 py-2" />
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-lg font-bold">Consonants</h4>
            <p>
              There are 21 consonants in Standard Thai. Table E contains
              examples of Thai words with these consonants along with their
              closest English equivalents. When two English words are given,
              the Thai sound is in between the two English sounds. Note that
              the symbol ? stands for a closing of the throat as in the middle
              of uh-uh (the English grunt meaning 'no').
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-center">
                <caption className="caption-top py-2 text-lg font-bold">
                  Table E: Consonants
                </caption>
                <thead>
                  <tr>
                    <th className="border border-black px-3 py-2">Consonant</th>
                    <th className="border border-black px-3 py-2">Thai</th>
                    <th className="border border-black px-3 py-2">Meaning</th>
                    <th className="border border-black px-3 py-2">English</th>
                    <th className="border border-black px-3 py-2">Consonant</th>
                    <th className="border border-black px-3 py-2">Thai</th>
                    <th className="border border-black px-3 py-2">Meaning</th>
                    <th className="border border-black px-3 py-2">English</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">h</td>
                    <td className="border border-black px-3 py-2">hěn</td>
                    <td className="border border-black px-3 py-2">see</td>
                    <td className="border border-black px-3 py-2">h</td>
                    <td className="border border-black px-3 py-2 font-bold">?</td>
                    <td className="border border-black px-3 py-2">?it</td>
                    <td className="border border-black px-3 py-2">brick</td>
                    <td className="border border-black px-3 py-2">it</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ph</td>
                    <td className="border border-black px-3 py-2">phit</td>
                    <td className="border border-black px-3 py-2">wrong</td>
                    <td className="border border-black px-3 py-2">p</td>
                    <td className="border border-black px-3 py-2 font-bold">p</td>
                    <td className="border border-black px-3 py-2">pèèt</td>
                    <td className="border border-black px-3 py-2">eight</td>
                    <td className="border border-black px-3 py-2">p-b</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">th</td>
                    <td className="border border-black px-3 py-2">thii</td>
                    <td className="border border-black px-3 py-2">time</td>
                    <td className="border border-black px-3 py-2">t</td>
                    <td className="border border-black px-3 py-2 font-bold">t</td>
                    <td className="border border-black px-3 py-2">tûu</td>
                    <td className="border border-black px-3 py-2">cupboard</td>
                    <td className="border border-black px-3 py-2">t-d</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ch</td>
                    <td className="border border-black px-3 py-2">chiit</td>
                    <td className="border border-black px-3 py-2">inject</td>
                    <td className="border border-black px-3 py-2">ch</td>
                    <td className="border border-black px-3 py-2 font-bold">c</td>
                    <td className="border border-black px-3 py-2">cèt</td>
                    <td className="border border-black px-3 py-2">seven</td>
                    <td className="border border-black px-3 py-2">j-ch</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">kh</td>
                    <td className="border border-black px-3 py-2">khít</td>
                    <td className="border border-black px-3 py-2">think</td>
                    <td className="border border-black px-3 py-2">k</td>
                    <td className="border border-black px-3 py-2 font-bold">k</td>
                    <td className="border border-black px-3 py-2">kàt</td>
                    <td className="border border-black px-3 py-2">bite</td>
                    <td className="border border-black px-3 py-2">g-k</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">b</td>
                    <td className="border border-black px-3 py-2">bòy</td>
                    <td className="border border-black px-3 py-2">often</td>
                    <td className="border border-black px-3 py-2">b</td>
                    <td className="border border-black px-3 py-2 font-bold">f</td>
                    <td className="border border-black px-3 py-2">fan</td>
                    <td className="border border-black px-3 py-2">teeth</td>
                    <td className="border border-black px-3 py-2">f</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">d</td>
                    <td className="border border-black px-3 py-2">duu</td>
                    <td className="border border-black px-3 py-2">look at</td>
                    <td className="border border-black px-3 py-2">d</td>
                    <td className="border border-black px-3 py-2 font-bold">s</td>
                    <td className="border border-black px-3 py-2">sii</td>
                    <td className="border border-black px-3 py-2">four</td>
                    <td className="border border-black px-3 py-2">s</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">m</td>
                    <td className="border border-black px-3 py-2">mii</td>
                    <td className="border border-black px-3 py-2">have</td>
                    <td className="border border-black px-3 py-2">m</td>
                    <td className="border border-black px-3 py-2 font-bold">y</td>
                    <td className="border border-black px-3 py-2">yùu</td>
                    <td className="border border-black px-3 py-2">be at</td>
                    <td className="border border-black px-3 py-2">y</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">n</td>
                    <td className="border border-black px-3 py-2">nâw</td>
                    <td className="border border-black px-3 py-2">rotten</td>
                    <td className="border border-black px-3 py-2">n</td>
                    <td className="border border-black px-3 py-2 font-bold">w</td>
                    <td className="border border-black px-3 py-2">wii</td>
                    <td className="border border-black px-3 py-2">comb</td>
                    <td className="border border-black px-3 py-2">w</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2 font-bold">ŋ</td>
                    <td className="border border-black px-3 py-2">yuu</td>
                    <td className="border border-black px-3 py-2">snake</td>
                    <td className="border border-black px-3 py-2">sing</td>
                    <td className="border border-black px-3 py-2 font-bold">l</td>
                    <td className="border border-black px-3 py-2">lêɛk</td>
                    <td className="border border-black px-3 py-2">exchange</td>
                    <td className="border border-black px-3 py-2">l</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2" />
                    <td className="border border-black px-3 py-2" />
                    <td className="border border-black px-3 py-2" />
                    <td className="border border-black px-3 py-2" />
                    <td className="border border-black px-3 py-2 font-bold">r</td>
                    <td className="border border-black px-3 py-2">rêek</td>
                    <td className="border border-black px-3 py-2">first</td>
                    <td className="border border-black px-3 py-2">r</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-lg font-bold">Tone</h4>
            <p>
              There are five tones in Standard Thai. Their names and symbols,
              together with examples of each are given in the table below.
            </p>

            <div className="overflow-x-auto">
              <table className="mx-auto w-full max-w-2xl border-collapse border border-black text-center">
                <caption className="caption-top py-2 text-lg font-bold">
                  Table F: Tones
                </caption>
                <thead>
                  <tr>
                    <th className="border border-black px-3 py-2">Name</th>
                    <th className="border border-black px-3 py-2">Symbol</th>
                    <th className="border border-black px-3 py-2">Thai</th>
                    <th className="border border-black px-3 py-2">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-3 py-2">Mid</td>
                    <td className="border border-black px-3 py-2 italic">no symbol</td>
                    <td className="border border-black px-3 py-2 font-bold">dii</td>
                    <td className="border border-black px-3 py-2">good</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2">Low</td>
                    <td className="border border-black px-3 py-2 font-bold">ˋ</td>
                    <td className="border border-black px-3 py-2 font-bold">sii</td>
                    <td className="border border-black px-3 py-2">four</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2">Falling</td>
                    <td className="border border-black px-3 py-2 font-bold">ˆ</td>
                    <td className="border border-black px-3 py-2 font-bold">hâa</td>
                    <td className="border border-black px-3 py-2">five</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2">High</td>
                    <td className="border border-black px-3 py-2 font-bold">´</td>
                    <td className="border border-black px-3 py-2 font-bold">náam</td>
                    <td className="border border-black px-3 py-2">water</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-3 py-2">Rising</td>
                    <td className="border border-black px-3 py-2 font-bold">ˇ</td>
                    <td className="border border-black px-3 py-2 font-bold">sɔ̌ɔŋ</td>
                    <td className="border border-black px-3 py-2">two</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
