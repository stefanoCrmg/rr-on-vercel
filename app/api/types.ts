// Pokemon API Type Definitions

export interface PokemonListItem {
	name: string
	url: string
}

export interface PokemonListResponse {
	count: number
	next: string | null
	previous: string | null
	results: PokemonListItem[]
}

export interface PokemonType {
	slot: number
	type: {
		name: string
		url: string
	}
}

export interface PokemonStat {
	base_stat: number
	effort: number
	stat: {
		name: string
		url: string
	}
}

export interface PokemonAbility {
	ability: {
		name: string
		url: string
	}
	is_hidden: boolean
	slot: number
}

export interface PokemonSprite {
	front_default: string | null
	front_shiny: string | null
	front_female: string | null
	front_shiny_female: string | null
	back_default: string | null
	back_shiny: string | null
	back_female: string | null
	back_shiny_female: string | null
	other?: {
		"official-artwork"?: {
			front_default: string | null
			front_shiny: string | null
		}
		home?: {
			front_default: string | null
			front_female: string | null
			front_shiny: string | null
			front_shiny_female: string | null
		}
		dream_world?: {
			front_default: string | null
			front_female: string | null
		}
	}
}

export interface Pokemon {
	id: number
	name: string
	height: number
	weight: number
	base_experience: number
	types: PokemonType[]
	stats: PokemonStat[]
	abilities: PokemonAbility[]
	sprites: PokemonSprite
	species: {
		name: string
		url: string
	}
}

export interface FlavorTextEntry {
	flavor_text: string
	language: {
		name: string
		url: string
	}
	version: {
		name: string
		url: string
	}
}

export interface PokemonSpecies {
	id: number
	name: string
	order: number
	gender_rate: number
	capture_rate: number
	base_happiness: number
	is_baby: boolean
	is_legendary: boolean
	is_mythical: boolean
	hatch_counter: number
	has_gender_differences: boolean
	forms_switchable: boolean
	growth_rate: {
		name: string
		url: string
	}
	evolution_chain: {
		url: string
	}
	flavor_text_entries: FlavorTextEntry[]
	generation: {
		name: string
		url: string
	}
	genera: {
		genus: string
		language: {
			name: string
			url: string
		}
	}[]
}

export interface EvolutionDetail {
	min_level: number | null
	trigger: {
		name: string
		url: string
	}
	item: { name: string } | null
	gender: number | null
	held_item: { name: string } | null
	known_move: { name: string } | null
	known_move_type: { name: string } | null
	location: { name: string } | null
	min_happiness: number | null
	min_beauty: number | null
	min_affection: number | null
	needs_overworld_rain: boolean
	party_species: { name: string } | null
	party_type: { name: string } | null
	relative_physical_stats: number | null
	time_of_day: string
	trade_species: { name: string } | null
	turn_upside_down: boolean
}

export interface ChainLink {
	is_baby: boolean
	species: {
		name: string
		url: string
	}
	evolution_details: EvolutionDetail[]
	evolves_to: ChainLink[]
}

export interface EvolutionChain {
	id: number
	baby_trigger_item: { name: string } | null
	chain: ChainLink
}

export interface TypeRelations {
	no_damage_to: { name: string; url: string }[]
	half_damage_to: { name: string; url: string }[]
	double_damage_to: { name: string; url: string }[]
	no_damage_from: { name: string; url: string }[]
	half_damage_from: { name: string; url: string }[]
	double_damage_from: { name: string; url: string }[]
}

export interface TypeInfo {
	id: number
	name: string
	damage_relations: TypeRelations
	pokemon: {
		slot: number
		pokemon: {
			name: string
			url: string
		}
	}[]
	generation: {
		name: string
		url: string
	}
}
