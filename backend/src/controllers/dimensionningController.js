const Configuration= require("../models/configuration");
const ConfigLoadProfile= require("../models/config_load_profile")

// Créer un profil de consommation
const consomationProfile=async(req,res)=>{
    try {
        const {configId}=req.params

        const {bill_mode,Ej_day_kwh,Ej_night_kwh,appliances}=req.body||{};

        const config = await Configuration.findByPk(configId);
        if(!config){
            return res.status(404).json({ error: 'Configuration introuvable' });
        }

        let details, Ej_day_wh=0, Ej_night_wh=0;

        if(bill_mode){
            // Mode Facture
            if(!Number.isFinite(Ej_day_kwh)||!Number.isFinite(Ej_night_kwh)){
                return res.status(400).json({error:"En mode facture, Ej_day_Kwh et Ej_night_Kwh sont requis"});
            }
            
            Ej_day_wh= Ej_day_kwh*1000;
            Ej_night_wh= Ej_night_kwh *1000;
            details= {Ej_day_kwh,Ej_night_kwh};
        }else{
            // Mode appareils
            if(!Array.isArray(appliances)||appliances.length===0){
                return res.status(400).json({error:"Le champ 'appliances est requis si bill_mode = false"});
            }

            details= appliances.map((a,idx)=>{
                const name = a.name || `appareil_${idx}`;
                const qty = Number(a.qty);
                const powerW = Number(a.power_w);
                const hoursDay = Number(a.hours_day||0);
                const hoursNight=Number(a.hours_night||0);

                if(!qty||!powerW){
                    throw new Error(`Entré invalide pour ${name}`);                    
                }

                const PitemW=qty*powerW;
                const EdayItem=PitemW*hoursDay;
                const EnightItem=PitemW*hoursNight;

                Ej_day_wh+=EdayItem;
                Ej_night_wh+=EnightItem;

                return{
                    name,
                    qty,
                    power_w:powerW,
                    power_total_w:PitemW,
                    hours_day:hoursDay,
                    hours_night:hoursNight,
                    energy_day_Wh:EdayItem,
                    energy_night_Wh:EnightItem,
                }
            })
        }
        // Energie total dans une journée (jour + nuit)
        const Ej_total_wh=Ej_day_wh+Ej_night_wh;

        const profile = await ConfigLoadProfile.create({
            configuration_id:configId,
            mode:bill_mode ?"bill":"appliances",
            details,
            Ej_day_wh,
            Ej_night_wh,
            Ej_total_wh,
        })
        return res.status(201).json(profile)
    } catch (error) {
        console.error("Erreur lords de la définition du profil de consommeation: ",error)
          return res.status(400).json({ error: error.message });
    }
}

//Lire un profil de consommation
const getConsommationProfileµByConfiguration=async(req, res)=>{
    try {
        const {configId}=req.params;

        const profile=await  ConfigLoadProfile.findOne({
            where: { configuration_id: configId }
        });

        if(!profile){
             return res.status(404).json({ error: "Aucun profil de consommation trouvé pour cette configuration" });
        }

        return res.status(200).json(profile)
    } catch (error) {
            console.error("Erreur lors de la récupération du profil",error);
    return res.status(500).json({ error: "Erreur lors de la récupération du profil" });
    }
}

// Modifier un profil de consommation
const updateConsommationProfile=async(req,res)=>{
    try {
    const { configId } = req.params;
    const { bill_mode, Ej_day_kWh, Ej_night_kWh, appliances } = req.body;

        let profile= await ConfigLoadProfile.findOne({
            where: { configuration_id: configId } 
        });

        if(!profile){
             return res.status(404).json({ error: "Aucun profil de consommation trouvé pour cette configuration" });
        }

        let details, Ej_day_wh=0,Ej_night_wh=0 ;
        if(bill_mode){
        // Mode Facture
        if(!Number.isFinite(Ej_day_kwh)||!Number.isFinite(Ej_night_kwh)){
            return res.status(400).json({error:"En mode facture, Ej_day_Kwh et Ej_night_Kwh sont requis"});
        }
            
            Ej_day_wh = Ej_day_kWh * 1000;
            Ej_night_wh = Ej_night_kWh * 1000;
            details= {Ej_day_Kwh,Ej_night_Kwh};
        }else{
            // mode appliances
             if (!Array.isArray(appliances) || appliances.length === 0) {
                return res.status(400).json({ error: "Appliances requis si bill_mode = false" });
            }

            details= appliances.map((a,idx)=>{
                const name = a.name || `appareil_${idx}`;
                const qty = Number(a.qty);
                const powerW = Number(a.power_w);
                const hoursDay = Number(a.hours_day||0);
                const hoursNight=Number(a.hours_night||0);

                if(!qty||!powerW){
                    throw new Error(`Entré invalide pour ${name}`);                    
                }

                const PitemW=qty*powerW;
                const EdayItem=PitemW*hoursDay;
                const EnightItem=PitemW*hoursNight;

                Ej_day_wh+=EdayItem;
                Ej_night_wh+=EnightItem;

                return{
                    name,
                    qty,
                    power_w:powerW,
                    power_total_w:PitemW,
                    hours_day:hoursDay,
                    hours_night:hoursNight,
                    energy_day_Wh:EdayItem,
                    energy_night_Wh:EnightItem,
                }
            })
        }

         // Energie total dans une journée (jour + nuit)
        const Ej_total_wh=Ej_day_wh+Ej_night_wh;
    
            await profile.update({
            mode:bill_mode ?"bill":"appliances",
            details,
            Ej_day_wh,
            Ej_night_wh,
            Ej_total_wh,
        })

        return res.status(200).json(profile)
    } catch (error) {
    console.error("Erreur lors de la modification du profil",error);
    return res.status(500).json({ error: "Erreur lors de la modification du profil" });
    }
}

// Supprimer le profil de consommation d'une configuration
const deleteConsommationProfile=async(req,res)=>{
    try {
        const  {configId}=req.params;

         const profile = await ConfigLoadProfile.findOne({ where: { configuration_id: configId } });
    if (!profile) {
      return res.status(404).json({ error: "Aucun profil de consommation trouvé pour cette configuration" });
    }

    await profile.destroy();

    return res.status(200).json({message:"Profil de consommation supprimé avec succès"})
    } catch (error) {
            console.error( "Erreur lors de la suppression du profil de consommation",error);
    return res.status(500).json({ error: "Erreur lors de la suppression du profil de consommation" });
    }
}

// MODULE PV ARRAYS

// Ajouter un champ PV à une configuration

module.exports={
    consomationProfile,
    getConsommationProfileµByConfiguration,
    updateConsommationProfile,  
    deleteConsommationProfile, 
}