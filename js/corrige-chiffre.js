/* =========================================================
   corrige-chiffre.js — corrigé de l'escape game, CHIFFRÉ
   ---------------------------------------------------------
   Ce fichier ne contient aucune réponse en clair : les
   solutions sont chiffrées en AES-256-GCM avec une clé
   dérivée du mot de passe enseignant (PBKDF2, 250000 tours).

   Pour lire ou modifier le corrigé : ouvrir outils.html.
   ========================================================= */

const CORRIGE_CHIFFRE = {
  version: 1,
  iterations: 250000,
  sel: "UK1QQz1yPumEceWdJ8/P1Q==",
  iv: "lCGUpdXU85PkaUmO",
  donnees: "BrL53/bZpvfP/cb1SFYnaQnvUi4fUjn2sHJZf5soEPJXrMpf2ImnkooXIbLZFlRTbbwEngPV+oqBmpXCJtWF8ifFRzN2i5/YJ+FGtk902wqENsCfBSU9BhycQKUcaLbAN9IThgpcemTSb05ytt0/VuJ9iJ7SQ09MVVJt1QI8B2+JP3xzCPpAUKBJubC+qhjVvxTCu1fr8ppJ3TW/n1bYhUIPIkH2b7g73naDhOCBY7SvcbMXXaU/uFicMgISYFyziS6+WtzQtjaBReHn6lJv1b8EIGd3ntZwWK6fW/B7JXjVOO9BOyrjbc83pMICzCFlI1X+xUjRBzCRAujEttsV+fDwiIfx4sh5vJ5FF2Y4Ti2pzPIZ7Z9ZhQZiFfBUiyz91Maydxy5Mqnv6RyqhJ4/OhCgDVDuAMRFlRL2zjErqdB2JmypYUoGGfiePYVZOnok+Ch0hYa13cBi84Ki3/YyQiLJpxQn7gbUEjDCEEAdhSq5wLymZ4ZKdEfyZDYdlvLBmdp//l9yJVtZDat+qXEIhwX6FCUiT5Fz9L5Tnsq0xzcFWteJFL1skEdQWLhPsJfqDlli6npzpHq9iA2c8WaxZX3Be4GF3BbLahtmrgp1jxmpvufn0hL+TPdF0kGEpfhdSBEbdEFLt4AE52CdSfRqSOW+Jdo/M+CXeNVO5GQtpugt8kT4yIaP3VSMaUPjnC5XMGmiMZfAGYoHv8kVR/lRuj7Mcanq3hGaQeWmtTimOvqLXoiBP320347dn2W37uVaFay9MaDmwob/wyhCILq+5heEtI8GYWPPWKVbYZJiJfk2HhP6pXEvuQTHASmboDB3GsooLh6IlGhEl0z9nHN8b6tZcBPMbOuC8Widy2xt2zAvFCp0SrzcC028hTHxV0FNil6uRz22tlhjeUBu/5hhRYvu2q9KD8E64iIpeXpNp4LEeogUwAxPOyiIg85ePhTlJMOhYtUu6MWifZS9HljrLiazmwSfedh3geV6tjuvtMTNMk1LDwFAzHy7d51Z17D1MhZghyk63OB6jcMe2gP3qGKga9Ln2n5eSfHBuasdwMw/O05cxxCgV1PdCOGVXI6wCxaWTNZ14tulsj+yAWIPwS+1VuuNXD2RDJYJwasPHHzy/M5a6NXx2UL3JmKdDef4LxAcnwJTP6pDDkr1QweDVynCihlNiz2sYaMgcGAq06hZOPunHcDsCOKkXjXcymgUotDHqD1tBk1xv40uWojizhvsqOxGa7hophFRywEr9dMcXX6wdRVOVm9hteE0IjPIbYecj16XTatLtpLSHCw0D04A1FI91bUKcpsXni9hFtsRfnv86D97DEqNJweVkojWne27fRVP3xjrS7X7OsKzEjFjWhvbgtgeK/bScwiDVDXvhpgHXaklfAcVzMqUJXz754yksgwBMp2aXUZlmW1T5zAKPBWs+Qo7cUBboN2tVOIc/0FViTKeiOLS+v3vKoIziso8GHLfMEzj+4t1UfJA9tcbjzEhDpruktexdK89g2sEsU0LPZCMxxrQXt3did34L2+10KkhbM2XAQGqUhsy5tY3StcxAAG06zHgm/sDu4v5p9b5zUcqDkwf5oy5rFz6yHOunlsgRcFTNyT82eggp/2bHxpZI+CBFmzR5wN1Jl91Q8Wx05YhBnTOAuZGnHnPuqKFo5bFjM5vfjL43m7/v83R+xn+WMeUWKlfHCOFuOdbn7ZITiZVhfWp7oRb/8sqvOYrwuAhd6PkwWI/0jvWu98Fasc8D2K382UxxszP/iTwK0x8Aa7Jsh4lk4U9vDCE3C6HBvjtzoki3xahZD8hqoOsBVTwHAQAYpD7M3WyIFDMhr/mZDMNWqBcJS0z1XyEEog0UNPccPW95Yn/dxCVp/+/1GHno45NQ0xOxUZ8lVjLp9rRZBH61zacJgqhGl6Vmza1UJftGOOy7uvdsQ=="
};

if (typeof window !== 'undefined') window.CORRIGE_CHIFFRE = CORRIGE_CHIFFRE;
