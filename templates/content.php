<?php
$minpassed = ( current_time( 'timestamp', 0 ) - get_post_time('U', false) ) / 60;
$auteurpos = ( (get_the_author_meta('ID')-1) / count(get_users()) ) * 100;

$minpassedpercent = ( $minpassed / 18767 ) *100;

?>
<article class="item inspace" <?php post_class(); ?> style="top: <?php echo $minpassed ?>px; left: <?php echo $auteurpos ?>%" data-auteur="<?php echo get_the_author_meta('ID')?>" data-minutesecoulees="<?php echo $minpassed ?>">
	<div class="content">
		<header class="name">
			<div class="meta">
				<?php get_template_part('templates/entry-meta'); ?>
			</div>
			<a href="<?php the_permalink(); ?>"><h2><?php the_title(); ?></h2></a>
		</header>
		<div class="entry-summary description">
			<?php the_content(); ?>
		</div>
	</div>
</article>
