export const IFRS_DECK_TITLE = "IFRS & French GAAP";

export const IFRS_DECK = {
  title: IFRS_DECK_TITLE,
  description: "50 questions pour maîtriser les principaux écarts entre IFRS et normes françaises.",
  color: "violet",
  cards: [
    {
      question: "À quoi servent les normes IFRS ?",
      answer: "Les IFRS visent à produire une information financière comparable, transparente et utile aux investisseurs. Elles sont principalement conçues pour les comptes consolidés et privilégient la substance économique des opérations.",
    },
    {
      question: "Quelle est la différence de logique générale entre IFRS et French GAAP ?",
      answer: "Les IFRS sont davantage orientées vers l'information des investisseurs et la substance économique. Le PCG français accorde historiquement plus de place à la forme juridique, au coût historique, à la prudence et aux liens avec la fiscalité.",
    },
    {
      question: "Quelles sociétés doivent utiliser les IFRS dans l'Union européenne ?",
      answer: "Les sociétés cotées sur un marché réglementé de l'UE doivent utiliser les IFRS adoptées par l'UE pour leurs comptes consolidés. En France, les comptes individuels restent établis selon les règles françaises.",
    },
    {
      question: "Quelle norme encadre une première adoption des IFRS ?",
      answer: "IFRS 1. L'entité prépare un bilan d'ouverture IFRS à la date de transition et applique en principe rétrospectivement les normes en vigueur, sous réserve d'exceptions obligatoires et d'exemptions optionnelles.",
    },
    {
      question: "Qu'appelle-t-on la date de transition selon IFRS 1 ?",
      answer: "C'est le début de la première période comparative présentée intégralement en IFRS. Pour des premiers comptes IFRS au 31 décembre N avec un comparatif N-1, la date de transition est généralement le 1er janvier N-1.",
    },
    {
      question: "Quels rapprochements IFRS 1 demande-t-elle ?",
      answer: "Des rapprochements des capitaux propres entre l'ancien référentiel et les IFRS à la date de transition et à la fin du dernier exercice antérieur, ainsi qu'un rapprochement du résultat global de la dernière période comparative.",
    },
    {
      question: "Quels états composent un jeu complet d'états financiers IFRS ?",
      answer: "Un état de la situation financière, un ou plusieurs états de performance et du résultat global, un tableau des variations des capitaux propres, un tableau des flux de trésorerie et des notes, avec des informations comparatives.",
    },
    {
      question: "Le tableau des flux de trésorerie est-il obligatoire ?",
      answer: "Oui en IFRS, selon IAS 7. Dans les comptes individuels français, il ne fait pas partie des états de synthèse obligatoires de base, même s'il peut être présenté ou requis dans d'autres contextes.",
    },
    {
      question: "Qu'est-ce que l'importance relative, ou materiality ?",
      answer: "Une information est significative si son omission, son inexactitude ou son obscurcissement peut raisonnablement influencer les décisions des utilisateurs. L'analyse est à la fois quantitative et qualitative.",
    },
    {
      question: "Quand une immobilisation corporelle est-elle comptabilisée selon IAS 16 ?",
      answer: "Lorsqu'il est probable que les avantages économiques futurs iront à l'entité et que le coût peut être évalué de façon fiable. Le coût inclut notamment le prix d'achat et les coûts directement attribuables à sa mise en état de fonctionner.",
    },
    {
      question: "Qu'est-ce que l'approche par composants ?",
      answer: "Les parties significatives d'un actif ayant des durées d'utilité différentes sont comptabilisées et amorties séparément. Cette approche existe en IAS 16 et aussi en normes françaises.",
    },
    {
      question: "Comment traite-t-on les coûts de démantèlement d'une immobilisation ?",
      answer: "En IFRS, la valeur actualisée de l'obligation initiale est ajoutée au coût de l'actif et une provision est constatée. Le PCG prévoit aussi l'inclusion des coûts de démantèlement lorsqu'une obligation existe, avec des modalités françaises à vérifier selon le cas.",
    },
    {
      question: "Peut-on réévaluer les immobilisations corporelles en IFRS ?",
      answer: "Oui. IAS 16 permet de choisir le modèle du coût ou celui de la réévaluation pour une catégorie entière d'actifs, avec des réévaluations suffisamment régulières. Le dispositif français de réévaluation libre obéit à une logique juridique différente.",
    },
    {
      question: "Comment déterminer la durée d'amortissement en IFRS ?",
      answer: "Elle correspond à la durée d'utilité attendue pour l'entité, en tenant compte du mode de consommation des avantages économiques. La durée, la valeur résiduelle et le mode d'amortissement sont revus au moins à chaque clôture.",
    },
    {
      question: "Quel est le traitement des coûts d'emprunt selon IAS 23 ?",
      answer: "Les coûts directement attribuables à l'acquisition ou la construction d'un actif qualifié doivent être incorporés à son coût. Dans les comptes individuels français, leur incorporation constitue généralement une option sous conditions.",
    },
    {
      question: "Quelle différence entre frais de recherche et frais de développement selon IAS 38 ?",
      answer: "Les dépenses de recherche sont comptabilisées en charges. Les dépenses de développement sont immobilisées à partir du moment où tous les critères d'IAS 38 sont démontrés, notamment faisabilité, intention, ressources et avantages futurs probables.",
    },
    {
      question: "Les frais de développement sont-ils toujours immobilisés en French GAAP ?",
      answer: "Non. Sous conditions, leur activation est possible et constitue la méthode de référence du PCG, mais une comptabilisation en charges peut subsister. En IFRS, l'activation devient obligatoire dès que les critères d'IAS 38 sont remplis.",
    },
    {
      question: "Une marque créée en interne peut-elle être immobilisée ?",
      answer: "Non en IFRS : IAS 38 interdit notamment de reconnaître les marques, fichiers clients et fonds commerciaux générés en interne. Les dépenses correspondantes sont généralement passées en charges ; le traitement français est également restrictif.",
    },
    {
      question: "Qu'est-ce qu'un immeuble de placement selon IAS 40 ?",
      answer: "C'est un bien immobilier détenu pour percevoir des loyers ou valoriser le capital, plutôt que pour produire, vendre ou être occupé par l'entité. IAS 40 permet ensuite un modèle du coût ou de la juste valeur ; le PCG n'a pas de catégorie équivalente aussi structurée.",
    },
    {
      question: "Quel est le principe du test de dépréciation selon IAS 36 ?",
      answer: "Si des indices de perte de valeur existent, on compare la valeur comptable à la valeur recouvrable, soit le montant le plus élevé entre valeur d'utilité et juste valeur diminuée des coûts de sortie.",
    },
    {
      question: "Qu'est-ce qu'une unité génératrice de trésorerie, ou UGT ?",
      answer: "C'est le plus petit groupe d'actifs générant des entrées de trésorerie largement indépendantes. On l'utilise quand la valeur recouvrable d'un actif ne peut pas être estimée isolément.",
    },
    {
      question: "Une dépréciation peut-elle être reprise en IFRS ?",
      answer: "Oui si les estimations se sont améliorées, mais la nouvelle valeur ne peut dépasser celle qui aurait résulté de l'amortissement normal. Une dépréciation du goodwill ne peut jamais être reprise en IFRS.",
    },
    {
      question: "Comment évalue-t-on les stocks selon IAS 2 ?",
      answer: "Au plus faible du coût et de la valeur nette de réalisation. Le coût inclut achats, transformation et autres coûts nécessaires pour amener le stock à son lieu et dans son état actuels.",
    },
    {
      question: "La méthode LIFO est-elle autorisée ?",
      answer: "Non en IFRS. IAS 2 autorise notamment FIFO ou le coût moyen pondéré pour des éléments fongibles. Le PCG français n'autorise pas non plus le LIFO comme méthode usuelle de valorisation.",
    },
    {
      question: "Quand comptabilise-t-on une provision selon IAS 37 ?",
      answer: "Lorsqu'une obligation actuelle issue d'un événement passé existe, qu'une sortie de ressources est probable et que le montant peut être estimé de façon fiable. Sinon, une information sur un passif éventuel peut être requise.",
    },
    {
      question: "Les provisions doivent-elles être actualisées ?",
      answer: "En IFRS, oui lorsque l'effet de la valeur temps est significatif. En règles françaises, l'actualisation est moins systématique et dépend du cadre applicable ; c'est donc un retraitement fréquent lors d'un passage aux IFRS.",
    },
    {
      question: "Comment les engagements de retraite sont-ils traités selon IAS 19 ?",
      answer: "Les régimes à prestations définies donnent lieu à une obligation actuarielle, généralement calculée par la méthode des unités de crédit projetées, diminuée des actifs du régime. Les réévaluations sont comptabilisées en autres éléments du résultat global.",
    },
    {
      question: "Quelles sont les cinq étapes d'IFRS 15 ?",
      answer: "Identifier le contrat, identifier les obligations de performance, déterminer le prix de transaction, allouer ce prix aux obligations, puis reconnaître le chiffre d'affaires lorsque ou à mesure que chaque obligation est satisfaite.",
    },
    {
      question: "Quand le chiffre d'affaires est-il reconnu selon IFRS 15 ?",
      answer: "Lorsque le contrôle du bien ou service est transféré au client. Le transfert peut intervenir à un instant donné ou progressivement si l'un des critères de reconnaissance à l'avancement est rempli.",
    },
    {
      question: "Qu'est-ce qu'une obligation de performance ?",
      answer: "C'est une promesse de transférer au client un bien ou service distinct, ou une série de biens ou services distincts substantiellement identiques. Chaque obligation identifiée détermine le rythme de reconnaissance du revenu.",
    },
    {
      question: "Comment IFRS 15 traite-t-elle une contrepartie variable ?",
      answer: "Elle est estimée selon la valeur attendue ou le montant le plus probable, puis limitée au montant dont il est hautement probable qu'il ne donnera pas lieu à une reprise significative du revenu.",
    },
    {
      question: "Comment distingue-t-on principal et agent sous IFRS 15 ?",
      answer: "Le principal contrôle le bien ou service avant son transfert et présente le revenu brut. L'agent organise la fourniture par un tiers et ne reconnaît généralement que sa commission nette.",
    },
    {
      question: "Quel est le principe d'IFRS 16 chez le preneur ?",
      answer: "La plupart des contrats de location donnent lieu à un actif de droit d'utilisation et à une dette locative. Les principales exemptions concernent les contrats courts et les actifs de faible valeur.",
    },
    {
      question: "Quelle différence majeure pour les locations entre IFRS et comptes individuels français ?",
      answer: "IFRS 16 inscrit généralement le droit d'utilisation et la dette au bilan du preneur. Dans les comptes individuels français, les loyers restent généralement en charges et les engagements sont présentés en annexe ; les comptes consolidés français ont leurs propres règles.",
    },
    {
      question: "Comment IFRS 9 classe-t-elle les actifs financiers ?",
      answer: "Le classement dépend du modèle économique de gestion et des caractéristiques des flux contractuels, notamment le test SPPI. Les principales catégories sont coût amorti, juste valeur par OCI et juste valeur par résultat.",
    },
    {
      question: "Qu'est-ce que le test SPPI ?",
      answer: "Il vérifie si les flux contractuels sont uniquement des remboursements de principal et des intérêts sur le principal restant dû. Il contribue à déterminer si un actif peut être évalué au coût amorti ou à la juste valeur par OCI.",
    },
    {
      question: "Comment fonctionne le modèle de pertes de crédit attendues d'IFRS 9 ?",
      answer: "La dépréciation anticipe les pertes futures dès la comptabilisation de l'actif. Elle porte sur les pertes à douze mois, puis sur les pertes sur toute la durée de vie si le risque de crédit augmente sensiblement.",
    },
    {
      question: "Quelle est la différence entre une dette et un instrument de capitaux propres selon IAS 32 ?",
      answer: "La substance du contrat prime : une obligation de remettre de la trésorerie indique généralement une dette, tandis qu'un instrument sans obligation contractuelle de paiement peut relever des capitaux propres.",
    },
    {
      question: "Comment IFRS 13 définit-elle la juste valeur ?",
      answer: "C'est le prix qui serait reçu pour vendre un actif ou payé pour transférer un passif lors d'une transaction normale entre intervenants de marché à la date d'évaluation. Il s'agit d'une valeur de sortie fondée sur le marché.",
    },
    {
      question: "Quels sont les trois niveaux de la hiérarchie de juste valeur ?",
      answer: "Niveau 1 : prix cotés non ajustés sur marchés actifs. Niveau 2 : autres données observables. Niveau 3 : données non observables reposant davantage sur des hypothèses et nécessitant plus d'informations en annexe.",
    },
    {
      question: "Qu'est-ce que la monnaie fonctionnelle selon IAS 21 ?",
      answer: "C'est la monnaie de l'environnement économique principal dans lequel l'entité exerce ses activités. Les transactions en devises sont converties dans cette monnaie, puis les éléments monétaires sont réévalués au cours de clôture.",
    },
    {
      question: "Comment traite-t-on les écarts de conversion en comptes individuels français ?",
      answer: "Les écarts latents sur créances et dettes en devises sont généralement inscrits au bilan en écarts de conversion. Une perte latente peut conduire à une provision pour risque de change, alors qu'IAS 21 comptabilise en principe les écarts monétaires en résultat.",
    },
    {
      question: "Quel est le principe des impôts différés selon IAS 12 ?",
      answer: "Ils traduisent les conséquences fiscales futures des différences temporaires entre la valeur comptable d'un actif ou passif et sa base fiscale, sous réserve d'exceptions. Ils sont obligatoires en IFRS.",
    },
    {
      question: "Les impôts différés figurent-ils dans les comptes individuels français ?",
      answer: "En règle générale, non : les comptes individuels constatent l'impôt exigible selon le PCG. Les impôts différés sont en revanche un sujet des comptes consolidés français et un retraitement central vers les IFRS.",
    },
    {
      question: "Comment IFRS 10 définit-elle le contrôle ?",
      answer: "Un investisseur contrôle une entité s'il détient le pouvoir sur elle, est exposé à des rendements variables et peut utiliser son pouvoir pour influencer ces rendements. Les trois critères doivent être réunis.",
    },
    {
      question: "Que devient une filiale contrôlée dans les comptes consolidés ?",
      answer: "Elle est intégrée globalement : ses actifs, passifs, produits et charges sont repris ligne à ligne, puis les opérations intragroupe sont éliminées et les intérêts ne donnant pas le contrôle sont présentés séparément.",
    },
    {
      question: "Quelle méthode IFRS 3 impose-t-elle pour un regroupement d'entreprises ?",
      answer: "La méthode de l'acquisition : identifier l'acquéreur et la date d'acquisition, évaluer les actifs et passifs identifiables généralement à leur juste valeur, puis déterminer le goodwill ou le profit d'acquisition à des conditions avantageuses.",
    },
    {
      question: "Comment le goodwill est-il traité en IFRS ?",
      answer: "Il n'est pas amorti. Il est affecté à des UGT ou groupes d'UGT et fait l'objet d'un test de dépréciation annuel, ainsi qu'en présence d'indices de perte de valeur ; une dépréciation constatée n'est pas reprise.",
    },
    {
      question: "Comment IFRS 5 traite-t-elle un actif non courant destiné à être vendu ?",
      answer: "S'il est disponible pour une vente immédiate et que celle-ci est hautement probable, il est présenté séparément et évalué au plus faible de sa valeur comptable et de sa juste valeur diminuée des coûts de vente. Son amortissement cesse.",
    },
    {
      question: "Comment les paiements fondés sur des actions sont-ils traités selon IFRS 2 ?",
      answer: "Une charge est reconnue en contrepartie des capitaux propres ou d'une dette. Pour une rémunération en instruments de capitaux propres, l'évaluation repose généralement sur la juste valeur à la date d'attribution et est étalée sur la période d'acquisition des droits.",
    },
  ],
} as const;
